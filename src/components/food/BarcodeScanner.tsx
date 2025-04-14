import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Button component exists

interface BarcodeScannerProps {
  onDetect: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onDetect, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    const startScanning = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          console.error('No camera found');
          return;
        }

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error) => {
            if (result && mounted) {
              const barcode = result.getText();
              onDetect(barcode);
              codeReader.reset();
            }
            if (error && error?.name !== 'NotFoundException') {
              console.error('Barcode scanning error:', error);
            }
          }
        );
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startScanning();

    return () => {
      mounted = false;
      codeReader.reset();
    };
  }, [onDetect]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        style={{
          transform: 'scaleX(-1)',
          maxHeight: '300px',
          objectFit: 'cover'
        }}
      />
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full z-10"
        onClick={onClose}
        aria-label="Close scanner"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Scanner Overlay */}
      <div className="absolute inset-0 border-4 border-dashed border-primary/50 rounded-lg pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-60 h-32">
          {/* Corner markers */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-md" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-md" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-md" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-md" />
          {/* Laser line (optional animation) */}
          {/* <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500 animate-scan-laser" /> */}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-white bg-black/60 px-3 py-1 rounded-full">
        Center the barcode in the frame
      </div>
    </div>
  );
};