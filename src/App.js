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

  const veroton =
    perusmaksu +
    osakkaat * osakasHinta +
    osakkaat * 2.14;

  const verollinen = veroton * (1 + ALV);

  const teePDF = async (ref, nimi) => {
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(nimi);
  };

  const teeWord = (ref, nimi) => {
    const html = `
      <html>
        <head><meta charset="utf-8"></head>
        <body>${ref.current.innerHTML}</body>
      </html>`;
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
            {[18,19,20,21,22].map(v => <option key={v} value={v}>{v} €</option>)}
          </select>
        </label>
      </div>

      {/* TARJOUS */}
      <div className="card" ref={tarjousRef}>
        <Header />

        <h2>TARJOUS</h2>
        <p><strong>{asiakas}</strong></p>
        <p>Tarjousnumero: {tarjousnumero}</p>
        <p>Päivämäärä: {new Date().toLocaleDateString("fi-FI")}</p>

        <h3>Hinnoittelu</h3>
        <table>
          <tbody>
            <tr><td>Perusmaksu</td><td>{perusmaksu} € / vuosi + alv</td></tr>
            <tr><td>Osakaskohtainen maksu</td><td>{osakkaat} × {osakasHinta} € / vuosi + alv</td></tr>
            <tr><td>Ohjelmistolisenssi</td><td>{osakkaat} × 2,14 € / vuosi + alv</td></tr>
            <tr className="total">
              <td><strong>Yhteensä</strong></td>
              <td><strong>{verollinen.toFixed(2)} € / vuosi</strong></td>
            </tr>
          </tbody>
        </table>

        <Palvelukuvaus />
        <Yhteystiedot />
      </div>

      <button onClick={() => teePDF(tarjousRef, "tarjous.pdf")}>Tarjous PDF</button>
      <button onClick={() => teeWord(tarjousRef, "tarjous.doc")}>Tarjous Word</button>

      {/* SOPIMUS */}
      <div className="card" ref={sopimusRef}>
        <Header />

        <h2>SOPIMUS</h2>
        <p>
          Tämä sopimus on tehty Saima Laskenta Oy:n ja <strong>{asiakas}</strong> välillä.
        </p>

        <h3>Sopimuksen hinnat</h3>
        <table>
          <tbody>
            <tr><td>Perusmaksu</td><td>{perusmaksu} € / vuosi + alv</td></tr>
            <tr><td>Osakaskohtainen maksu</td><td>{osakkaat} × {osakasHinta} € / vuosi + alv</td></tr>
            <tr><td>Ohjelmistolisenssi</td><td>{osakkaat} × 2,14 € / vuosi + alv</td></tr>
            <tr className="total">
              <td><strong>Yhteensä</strong></td>
              <td><strong>{verollinen.toFixed(2)} € / vuosi</strong></td>
            </tr>
          </tbody>
        </table>

        <Palvelukuvaus />

        <h3>Sopimusehdot</h3>
        <p>
          Sopimusta ei voida siirtää kolmannelle osapuolelle.
        </p>

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

function Header() {
  return (
    <div className="header">
      <img src="/logouus.png" className="logo" alt="Saima Laskenta" />
    </div>
  );
}

function Palvelukuvaus() {
  return (
    <>
      <h3>Tiekunnan hallinto – palvelun sisältö</h3>
      <ul>
        <li>Kokousten järjestäminen perinteisessä ja sähköisessä ympäristössä</li>
        <li>Sihteerinä ja esittelijänä toimiminen</li>
        <li>Laskutus ja reskontra</li>
        <li>Kokouskutsut</li>
        <li>Laskujen maksaminen</li>
        <li>Tilinpäätökset</li>
        <li>Yksiköinnin päivitykset</li>
        <li>Osakasluettelon ja osoitetietojen ylläpito</li>
        <li>Asiakirjojen laadinta ja viranomaisilmoitukset</li>
        <li>Neuvonta (hoitokunta ja osakkaat)</li>
        <li>Asiakirjojen jakaminen osakasportaalissa</li>
      </ul>

      <p className="note">
        Lisätyöt laskutetaan erikseen (75 €/h + alv 25,5 %).
        Kilometrikorvaus 0,55 €/km. Kulut laskutetaan toteutuneen mukaan.
      </p>
    </>
  );
}

function Yhteystiedot() {
  return (
    <div className="footer">
      <p><strong>Saima Laskenta Oy</strong></p>
      <p>Marianne Nurminen</p>
      <p>Tiirismäentie 225 B, 16730 Kutajärvi</p>
      <p>puh. 050 512 9835</p>
      <p>toimisto@saimalaskenta.fi</p>
    </div>
  );
}
