import { createContext, useContext, useState } from "react";
import { Camera } from "../components/Camera";


type CameraProps = {
  type: "photo" | "video" | "qrcode";
  onMediaCaptured: (type: string, data: any) => void;
};

interface CameraContextProps {
  openCamera: (props: CameraProps) => void;
  closeCamera: () => void;
}

const CameraContext = createContext<CameraContextProps | null>(null);

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error("CameraContext não encontrado.");
  return context;
};

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraProps, setCameraProps] = useState<CameraProps | null>(null);

  const openCamera = (props: CameraProps) => {
    setCameraProps(props);
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    setCameraProps(null);
  };

  return (
    <CameraContext.Provider value={{ openCamera, closeCamera }}>
      {children}
      {cameraVisible && cameraProps && (
        <Camera
          type={cameraProps.type}
          onMediaCaptured={cameraProps.onMediaCaptured}
          active={cameraVisible}
          onClose={closeCamera}
        />
      )}
    </CameraContext.Provider>
  );
};
