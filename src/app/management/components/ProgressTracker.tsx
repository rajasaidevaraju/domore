import { useEffect, useState } from "react";
import { ServerRequest } from "@/app/service/ServerRequest";

interface ProgressTrackerProps {
    file: File;
  }

const ProgressTracker: React.FC<ProgressTrackerProps>  = ({file}) => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);


  useEffect(()=>{
    console.log("Inside use effect of progress tracker")
    const handleFileUpload = async () => {
        if (file) {
          try {
            await ServerRequest.uploadFile(file, (progress, speed) => {
                //console.log(`progress: ${progress} speed: ${speed}`)
                
              //setProgress(progress);
              //setSpeed(speed);
            });
            console.log(`File ${file.name} uploaded successfully`);
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }
    };
    handleFileUpload()
  },[file])

  return (
    <div>
      <div>
        <p>Progress: {progress.toFixed(2)}%</p>
        <p>Speed: {(speed / 1024).toFixed(2)} KB/s</p>
      </div>
    </div>
  );
};

export default ProgressTracker;

