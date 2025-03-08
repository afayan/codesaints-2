export default function Alert({ score }) {
    if (score < 40) {
      return (
        <div className="alert alert-warning">
          <span>Human intervention required!</span>
        </div>
      );
    }
  
    if (score > 70) {
      return (
        <div className="alert alert-success">
          <span>Smooth conversation</span>
        </div>
      );
    }
  
    return (
      <div className="alert alert-neutral">
        <span>Conversation needs improvement</span>
      </div>
    );
  }
  