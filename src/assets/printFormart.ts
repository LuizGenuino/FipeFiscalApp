import { FishRecord } from "./types";

interface PrintFormatProps {
    fishRecord: FishRecord;
}

export function PrintFormat({ fishRecord }: PrintFormatProps) {
    return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #1f2937; text-align: center; }
          h2 { color: #6b7280; text-align: center; }
          .section { margin-top: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>42º FIPE</h1>
        <h2>Registro de Confirmação de Pesca</h2>

        <div class="section">
          <div class="row"><span class="bold">Código:</span><span>${fishRecord.team}</span></div>
          <div class="row"><span class="bold">Nº Ficha:</span><span>${fishRecord.ticket_number}</span></div>
          <div class="row"><span class="bold">Espécie:</span><span>${fishRecord.species}</span></div>
          <div class="row"><span class="bold">Tamanho:</span><span>${fishRecord.size} CM</span></div>
        </div>

        <div class="section">
          <div class="row"><span>Foto da Ficha:</span><span>${fishRecord.card_image ? '✓' : 'x'}</span></div>
          <div class="row"><span>Foto do Peixe:</span><span>${fishRecord.fish_image ? '✓' : 'x'}</span></div>
          <div class="row"><span>Vídeo da Soltura:</span><span>${fishRecord.fish_video ? '✓' : 'x'}</span></div>
        </div>

        <div class="section" style="text-align: center; margin-top: 30px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://google.com/${fishRecord.code}" />
          <div>${fishRecord.code}</div>
        </div>
      </body>
    </html>
  `
}