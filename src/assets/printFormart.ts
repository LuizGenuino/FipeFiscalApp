import { FishRecord } from "./types";

interface PrintFormatProps {
    fishRecord: FishRecord;
    dataURL: string
}

export function PrintFormat({ fishRecord, dataURL }: PrintFormatProps) {
    return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #1f2937; text-align: center; font-size: 18vw }
          h2 { color: #6b7280; text-align: center; font-size: 8vw }
          img {width: 50vw; height: 50vw;}
          span, p {font-size: 7vw}
          .section { margin-top: 20px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>42º FIPE</h1>
        <h2>Registro de Confirmação de Pesca</h2>
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="data:image/png;base64,${dataURL}"/>
                <p>${fishRecord.code}</p>
              </div>
        <div class="section">
          <div class="row"><span class="bold">Equipe:</span><span>${fishRecord.team}</span></div>
          <div class="row"><span class="bold">Nº Ficha:</span><span>${fishRecord.card_number}</span></div>
          <div class="row"><span class="bold">Espécie:</span><span>${fishRecord.species}</span></div>
          <div class="row"><span class="bold">Tamanho:</span><span>${fishRecord.size} Cm</span></div>
          <div class="row"><span class="bold">Pontuação:</span><span>${fishRecord.point} pts</span></div>
        </div>
      </body>
    </html>
  `
}