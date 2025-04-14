import { Camera, CameraResultType } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { supabase } from '@/integrations/supabase/client';

export const scanBarcode = async (): Promise<{
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
} | null> => {
  try {
    await BarcodeScanner.checkPermission({ force: true });
    await BarcodeScanner.prepare();

    document.querySelector('body')?.classList.add('scanner-active');
    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      const barcode = result.content;
      
      // Search food database using barcode
      const { data: foodData, error } = await supabase.functions.invoke('food-database-lookup', {
        body: { barcode }
      });

      if (error) throw error;
      
      if (foodData) {
        return {
          name: foodData.name,
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Barcode scanning error:', error);
    return null;
  } finally {
    document.querySelector('body')?.classList.remove('scanner-active');
    await BarcodeScanner.stopScan();
  }
};

export const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });

  return image.webPath;
};