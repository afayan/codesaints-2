import librosa
import numpy as np
import torch
import whisper
import pyaudio
import webrtcvad
import queue
import threading
from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import time
import json

# Device Setup (Enable GPU if available)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Audio Configuration
CHUNK = 320  # 20ms frame at 16000 Hz (320 samples)
FORMAT = pyaudio.paInt16  # Audio format (16-bit PCM)
CHANNELS = 1  # Mono audio
RATE = 16000  # Sampling rate (16 kHz)

# Initialize PyAudio
p = pyaudio.PyAudio()
stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

# Load Whisper Model (small for better accuracy)
model = whisper.load_model("tiny").to(device)

# Sentiment and Emotion Analyzers
sentiment_analyzer = SentimentIntensityAnalyzer()
emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

# Create WebRTC VAD
vad = webrtcvad.Vad(1)  # Aggressiveness mode (0-3)

# Audio Queue
text_queue = queue.Queue()
audio_buffer = []

# Speaker Identity
current_speaker = "Agent"  # Agent starts the conversation
last_speech_time = time.time()  # Track the last time speech was detected

# Minimum pause to switch speakers (in seconds)
MIN_PAUSE_TO_SWITCH = 1

def extract_audio_features(audio):
    """ Extracts pitch, loudness, and MFCCs from audio """
    # Convert bytes to NumPy array
    audio_np = np.frombuffer(audio, dtype=np.int16).astype(np.float32) / 32768.0
    
    # Compute features
    pitch = librosa.yin(audio_np, fmin=80, fmax=400, sr=RATE)  # Robust pitch detection
    pitch_mean = np.mean(pitch[pitch > 0]) if np.any(pitch > 0) else 0

    rms = librosa.feature.rms(y=audio_np)[0]
    loudness = np.mean(rms)  # Average loudness over the segment
    
    return pitch_mean, loudness

def analyze_text(text):
    """ Perform sentiment and emotion analysis on text. """
    sentiment = sentiment_analyzer.polarity_scores(text)
    sentiment_label = "Positive" if sentiment["compound"] > 0.05 else "Negative" if sentiment["compound"] < -0.05 else "Neutral"

    emotion_results = emotion_analyzer(text)
    emotion_label = emotion_results[0][0]["label"] if isinstance(emotion_results, list) and len(emotion_results) > 0 else "Unknown"

    return sentiment_label, emotion_label

def post_process_text(text):
    """Correct common transcription errors."""
    corrections = {
        "6th": "This",
        "oh don't": "I don't",
        # Add more corrections as needed
    }
    for wrong, correct in corrections.items():
        text = text.replace(wrong, correct)
    return text

def transcribe_audio():
    """ Speech-to-text, sentiment analysis, and speaker identification thread """
    global audio_buffer, current_speaker, last_speech_time

    while True:
        if len(audio_buffer) >= CHUNK:  # Process when buffer has enough data
            audio_data = b''.join(audio_buffer[:CHUNK])  # Take one chunk
            audio_buffer = audio_buffer[CHUNK:]  # Slide the window

            # Extract Audio Features
            pitch, loudness = extract_audio_features(audio_data)

            # Convert to NumPy for Whisper
            audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

            # Transcribe with Whisper (forcing English)
            result = model.transcribe(audio_np, fp16=False, language="en")
            text = result["text"].strip()

            if text:
                # Post-process text to correct errors
                text = post_process_text(text)

                # Perform sentiment and emotion analysis
                sentiment, emotion = analyze_text(text)
                text_queue.put((text, sentiment, emotion, pitch, loudness, current_speaker))

# Start transcription thread
threading.Thread(target=transcribe_audio, daemon=True).start()

print("Recording... Speak Now (Press Ctrl+C to Stop)")

print(json.dumps({
                "speaker": "start"
            }))

try:
    while True:
        # Read audio chunk
        data = stream.read(CHUNK, exception_on_overflow=False)

        # Check if it's speech
        if vad.is_speech(data, RATE):
            audio_buffer.append(data)
            last_speech_time = time.time()  # Update last speech time
        else:
            # Check for pause
            if time.time() - last_speech_time > MIN_PAUSE_TO_SWITCH:  # Pause longer than threshold
                if current_speaker == "Agent":
                    current_speaker = "User"  # Switch to User
                    print(" Switched to User")
                else:
                    current_speaker = "Agent"  # Switch back to Agent
                    print(" Switched to Agent")
                last_speech_time = time.time()  # Reset last speech time

        # Print transcription with sentiment analysis and speaker identity
        if not text_queue.empty():
            text, sentiment, emotion, pitch, loudness, speaker = text_queue.get()
            print(json.dumps({
                "speaker": speaker,
                "text": text,
                "sentiment": sentiment,
                "emotion": emotion,
                "pitch": f"{pitch:.2f}",
                "loudness": f"{loudness:.4f}"
            }))

            

            

except KeyboardInterrupt:
    print("\n Stopping Recording...")

finally:
    stream.stop_stream()
    stream.close()
    p.terminate()