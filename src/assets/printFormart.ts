import { FishRecord } from "./types";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const getBase64Logo = async (): Promise<string> => {
  try {
    const asset = Asset.fromModule(require('@/assets/images/logofipe.0ab6fef0.png'));
    await asset.downloadAsync(); // garante que foi carregada
    const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return "";

  }
};

interface PrintFormatProps {
  fishRecord: FishRecord;
  dataURL: string;
  logoBase64?: string;
}


export function PrintFormat({ fishRecord, dataURL, logoBase64 }: PrintFormatProps) {

  const createdAt = new Date(fishRecord.created_at || "").toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');



  return `
   <!DOCTYPE html>
<html lang="pt-BR" style="margin:0;padding:0;box-sizing:border-box;">
  <head>
    <meta charset="UTF-8">
    <title>Ficha de Pontuação - FIPe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#ffffff; color:#000000; margin:0; padding:40px 10px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; min-height:100vh;">

    <!-- Cabeçalho com logo e textos ao lado -->
    <div style="display:flex; align-items:center; justify-content:center; gap:20px; margin-bottom:30px;">
      <img src="${logoBase64}" alt="Logo FIPe" style="width:30vw; height:auto;">
      <div style="display:flex; flex-direction:column; justify-content:center;">
        <div style="font-size:5vw; font-weight:500; margin-bottom:4px;">Comprovante de Pesca</div>
        <div style="font-size:6vw; font-weight:700;">Categoria ${fishRecord.modality}</div>
      </div>
    </div>

    <!-- QRCode centralizado -->
    <div style="width:30vw; height:30vw; border:2px solid #000000; border-radius:12px; padding:10px; background:#ffffff;">
      <img src="data:image/png;base64,${dataURL}" alt="QRCode" style="width:100%; height:100%; object-fit:contain; border-radius:8px;">
    </div>

    <!-- Código principal -->
    <div style="font-size:5vw; font-weight:bold; margin-top:8px; margin-bottom:10px; text-align:center;">
      ${fishRecord.code}
    </div>

    <!-- Linha divisória -->
    <div style="width:100%; height:2px; background:#000000; margin-bottom:12px;"></div>

    <!-- Código do Time e Nº da Ficha alinhados e com mesmo tamanho -->
    <div style="display:flex; justify-content:center; gap:10px; width:100%; margin-bottom:12px;">
      <div style="flex:1; width:50%; border:3px solid #000000; padding:6px; border-radius:6px; text-align:center; font-size:6vw;">
        Código do Time:<br><strong>${fishRecord.team}</strong>
      </div>
      <div style="flex:1; width:50%; border:3px solid #000000; padding:6px; border-radius:6px; text-align:center; font-size:6vw;">
        Nº da Ficha:<br><strong>${fishRecord.card_number}</strong>
      </div>
    </div>

    <!-- Nome e imagem do peixe
    // <div style="text-align:center; margin-bottom:10px;">
    //   <div style="font-size:7vw; font-weight:700; margin-bottom:5px;">${fishRecord.species_id}</div>
    //   <img src="${fishRecord.fish_image}" alt="${fishRecord.species_id}" style=" width:40vw; height:auto; max-height: 40vw; border:3px solid #000; border-radius:8px;">
    // </div> -->

    <!-- Medida -->
    <div style="display:flex; justify-content:space-between; width:100%; font-size:5vw; margin:4vw 0;">
      <span>Medida:</span>
      <strong>${fishRecord.size} cm</strong>
    </div>

    <!-- Pontuação com borda tracejada -->
    <div style="font-size:7vw; font-weight:bold; padding:12px; border:5px dashed #000000; border-radius:10px; text-align:center; margin:8px 0;">
      Pontuação: ${fishRecord.total_points} Pts
    </div>

    <!-- Fiscal -->
    <div style="display:flex; justify-content:space-between; width:100%; font-size:5vw; margin-top:4vw;">
      <span>Fiscal:</span>
      <strong>${fishRecord.registered_by}</strong>
    </div>

    <!-- Data -->
    <div style="display:flex; justify-content:space-between; width:100%; font-size:5vw; margin:4vw 0;">
      <span>Data:</span>
      <strong>${createdAt}</strong>
    </div>

    <!-- Coordenada -->
    <div style="display:flex; justify-content:space-between; width:100%; font-size:5vw;">
      <span>Coordenada:</span>
      <strong>${fishRecord.latitude ? fishRecord.latitude.toFixed(6) : 0} x ${fishRecord?.longitude ? fishRecord?.longitude.toFixed(6) : 0}</strong>
    </div>

  </body>
</html>
  `
}