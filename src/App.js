import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./style.css";

export default function App() {
  const tarjousRef = useRef();
  const sopimusRef = useRef();

  const [asiakas, setAsiakas] = useState("");
  const [tarjousnumero, setTarjousnumero] = useState("");
  const [osakkaat, setOsakkaat] = useState(47);
  const [perusmaksu, setPerusmaksu] = useState(180);
  const [osakasHinta, setOsakasHinta] = useState(18);

  const ALV = 0.255;
  const veroton = perusmaksu + osakkaat * osakasHinta;
  const verollinen = veroton * (1 + ALV);

  /* PDF */
  const teePDF = async (ref, nimi) => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(nimi);
  };

  /* WORD */
  const teeWord = (ref, nimi) => {
    const html = `
      <html><head><meta charset="utf-8"></head>
      <body>${ref.current.innerHTML}</body></html>`;
    const blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nimi;
    link.click();
  };

  return (
    <div className="container">
      <h1>Tiekunnan tarjous- ja sopimuslaskuri</h1>

      {/* LASKURI */}
      <div className="card">
        <label>Asiakkaan nimi
          <input value={asiakas} onChange={e => setAsiakas(e.target.value)} />
        </label>

        <label>Tarjousnumero
          <input value={tarjousnumero} onChange={e => setTarjousnumero(e.target.value)} />
        </label>

        <label>Osakkaiden määrä
          <input type="number" value={osakkaat} onChange={e => setOsakkaat(+e.target.value)} />
        </label>

        <label>Perusmaksu €/vuosi
          <input type="number" value={perusmaksu} onChange={e => setPerusmaksu(+e.target.value)} />
        </label>

        <label>Osakaskohtainen maksu €/vuosi
          <select value={osakasHinta} onChange={e => setOsakasHinta(+e.target.value)}>
            {[18,19,20,21,22].map(v => (
              <option key={v} value={v}>{v} €</option>
            ))}
          </select>
        </label>
      </div>

      {/* TARJOUS */}
      <div className="card" ref={tarjousRef}>
        <Header title="TARJOUS" />
        <p><strong>Asiakas:</strong> {asiakas}</p>
        <p><strong>Tarjousnumero:</strong> {tarjousnumero}</p>
        <Hinnoittelu {...{ perusmaksu, osakkaat, osakasHinta, verollinen }} />
        <Palvelukuvaus />
        <Yhteystiedot />
      </div>

      <button onClick={() => teePDF(tarjousRef, "tarjous.pdf")}>Tarjous PDF</button>
      <button onClick={() => teeWord(tarjousRef, "tarjous.doc")}>Tarjous Word</button>

      {/* SOPIMUS */}
      <div className="card" ref={sopimusRef}>
        <Header title="SOPIMUS" />
        <p>
          Tämä sopimus on tehty Saima Laskenta Oy:n ja <strong>{asiakas}</strong> välillä.
          Sopimusta ei saa siirtää kolmannelle osapuolelle.
        </p>
        <Hinnoittelu {...{ perusmaksu, osakkaat, osakasHinta, verollinen }} />
        <Palvelukuvaus />
        <h3>Allekirjoitukset</h3>
        <p>_________________________<br/>Tilaaja</p>
        <p>_________________________<br/>Saima Laskenta Oy</p>
        <Yhteystiedot />
      </div>

      <button onClick={() => teePDF(sopimusRef, "sopimus.pdf")}>Sopimus PDF</button>
      <button onClick={() => teeWord(sopimusRef, "sopimus.doc")}>Sopimus Word</button>
    </div>
  );
}

/* ====== OSAT ====== */

function Header({ title }) {
  return (
    <div className="header">
      <img
        src="/tie-laskuri/logouus.png"
        alt="Saima Laskenta"
        className="logo"
      />
      <div>
        <h2>{title}</h2>
        <p>{new Date().toLocaleDateString("fi-FI")}</p>
      </div>
    </div>
  );
}

function Hinnoittelu({ perusmaksu, osakkaat, osakasHinta, verollinen }) {
  return (
    <>
      <h3>Hinnoittelu</h3>
      <table>
        <tbody>
          <tr><td>Perusmaksu</td><td>{perusmaksu} € / vuosi + alv</td></tr>
          <tr><td>Osakaskohtainen maksu</td><td>{osakkaat} × {osakasHinta} € / vuosi + alv</td></tr>
          <tr className="total"><td>Yhteensä</td><td>{verollinen.toFixed(2)} € / vuosi</td></tr>
        </tbody>
      </table>
    </>
  );
}

function Palvelukuvaus() {
  return (
    <>
      <h3>Tiekunnan hallinto – palvelun sisältö</h3>
      <ul>
        <li>Kokousten järjestäminen</li>
        <li>Sihteerinä ja esittelijänä toimiminen</li>
        <li>Laskutus ja reskontra</li>
        <li>Laskujen maksaminen</li>
        <li>Tilinpäätökset</li>
        <li>Yksiköinnin päivitykset</li>
        <li>Osakasluettelot ja viranomaisilmoitukset</li>
        <li>Neuvonta ja asiakirjojen jakaminen</li>
      </ul>
      <p className="note">Lisätyöt 75 €/h + alv 25,5 %.</p>
    </>
  );
}

function Yhteystiedot() {
  return (
    <div className="footer">
      <p><strong>Saima Laskenta Oy</strong></p>
      <p>Marianne Nurminen</p>
      <p>Tiirismäentie 225 B</p>
      <p>16730 KUTAJÄRVI</p>
      <p>puh. 050 512 9835</p>
      <p>toimisto@saimalaskenta.fi</p>
    </div>
  );
}
