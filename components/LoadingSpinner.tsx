export default function LoadingSpinner({ className = "h-5 w-5" }: { className?: string }) {
    return (
      <div className={className} >
        <div className={`spinner ${className}`}>
          {[...Array(12)].map((_, i) => (
            <div key={i} />
          ))}
        </div>
      </div>
    );
  }