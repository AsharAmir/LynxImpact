import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Settings,
  RefreshCw,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const partners = [
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/92/BMW_logo_%28gray%29.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/91/Audi_logo_%282016%29.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Volkswagen_logo_2019.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/39/Porsche_logo.svg",
  ];

  const beforeAfterImages = [
    {
      before: "https://i.postimg.cc/MKXYqFLf/image.png",
      after: "https://i.postimg.cc/XJpw4ZHS/image.png",
    },
    {
      before: "https://i.postimg.cc/WbM0Ncn3/image.png",
      after: "https://i.postimg.cc/ZRGymwvp/image.png",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a2a] text-white font-['Montserrat']">
      {" "}
      {/* Apply Montserrat to the whole page */}
      {/* Hero-seksjon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Cairo']">
            {" "}
            {/* Apply Cairo Bold to H1 */}
            <span className="bg-gradient-to-r from-[#b896ff] to-[#622efd] bg-clip-text text-transparent">
              Studiobilder med
            </span>
            <br />
            <span>LynxImpact</span>
          </h1>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            Vår avanserte maskinvare forandrer bildene dine til bilder tatt i
            studio. Ta bilder med kamera, last opp bildene så får du bilder
            produsert i studio!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/upload"
              className="px-8 py-4 bg-[#622efd] hover:bg-[#5b29e8] text-white font-medium rounded-lg transition-colors flex items-center group font-['Cairo'] font-bold" // Cairo Bold for button
            >
              Begynn forbedringen
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {/* <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#b896ff]" />
              Ingen kredittkort nødvendig
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#b896ff]" />
              Behandles på under 10 sekunder
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#b896ff]" />
              Profesjonell kvalitet
            </div>
          </div> */}
        </div>
      </div>
      {/* Funksjonsnett */}
      <div className="bg-[#121530] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-['Cairo']">
              Slik fungerer det
            </h2>{" "}
            {/* Cairo Bold for H2 */}
            <p>Transformer bilbildene dine i tre enkle trinn</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#070a2a] p-8 rounded-2xl border border-[#622efd]/20 shadow-sm">
              <div className="h-12 w-12 bg-[#622efd]/20 rounded-xl flex items-center justify-center mb-6">
                <Upload className="h-6 w-6 text-[#b896ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 font-['Cairo']">
                Last opp bilde
              </h3>{" "}
              {/* Cairo Bold for H3 */}
              <p>Bare dra og slipp bilbildet ditt eller velg fra enheten din</p>
            </div>
            <div className="bg-[#070a2a] p-8 rounded-2xl border border-[#622efd]/20 shadow-sm">
              <div className="h-12 w-12 bg-[#622efd]/20 rounded-xl flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-[#b896ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 font-['Cairo']">
                AI-behandling
              </h3>{" "}
              {/* Cairo Bold for H3 */}
              <p>
                Vår AI forbedrer belysning, fjerner bakgrunn og optimaliserer
                kvaliteten
              </p>
            </div>
            <div className="bg-[#070a2a] p-8 rounded-2xl border border-[#622efd]/20 shadow-sm">
              <div className="h-12 w-12 bg-[#622efd]/20 rounded-xl flex items-center justify-center mb-6">
                <RefreshCw className="h-6 w-6 text-[#b896ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 font-['Cairo']">
                Last ned
              </h3>{" "}
              {/* Cairo Bold for H3 */}
              <p>Få ditt bilde i studiokvalitet klart for profesjonell bruk</p>
            </div>
          </div>
        </div>
      </div>
      {/* Eksempelbilder */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-['Cairo']">
              Før og etter
            </h2>{" "}
            {/* Cairo Bold for H2 */}
            <p>Se forskjellen vår AI-forbedring gjør</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {beforeAfterImages.map((imagePair, index) => (
              <BeforeAfterSlider
                key={index}
                before={imagePair.before}
                after={imagePair.after}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Partnere */}
      {/* <div className="bg-[#121530] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-['Cairo']">
              Stolt av ledende merker
            </h2>  Cairo Bold for H2 
            <p>
              Vi jobber med verdens ledende bilfirmaer
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Partner logo"
                className="h-12 opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </div> */}
      {/* Statistikk */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#b896ff] mb-2 font-['Cairo']">
                {" "}
                {/* Cairo Bold for stats */}
                500K+
              </div>
              <div className="font-['Cairo']">Bilder forbedret</div>{" "}
              {/* Cairo Bold for stats description */}
            </div>
            <div>
              <div className="text-4xl font-bold text-[#b896ff] mb-2 font-['Cairo']">
                {" "}
                {/* Cairo Bold for stats */}
                98%
              </div>
              <div className="font-['Cairo']">Tilfredshetsrate</div>{" "}
              {/* Cairo Bold for stats description */}
            </div>
            <div>
              <div className="text-4xl font-bold text-[#b896ff] mb-2 font-['Cairo']">
                {" "}
                {/* Cairo Bold for stats */}
                60s
              </div>
              <div className="font-['Cairo']">
                Gjennomsnittlig behandlingstid
              </div>{" "}
              {/* Cairo Bold for stats description */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// BeforeAfterSlider-komponent
interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

const BeforeAfterSlider = ({ before, after }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  interface HandleMouseMoveEvent extends MouseEvent {
    clientX: number;
  }

  const handleMouseMove = (e: HandleMouseMoveEvent) => {
    if (!isDragging) return;

    const container = containerRef.current;
    if (!container) return;
    const x = e.clientX - container.offsetLeft;
    let newSliderPosition = (x / containerWidth) * 100;

    if (newSliderPosition < 0) newSliderPosition = 0;
    if (newSliderPosition > 100) newSliderPosition = 100;

    setSliderPosition(newSliderPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  interface HandleMouseDownEvent extends React.MouseEvent<HTMLDivElement> {}

  const handleMouseDown = (e: HandleMouseDownEvent) => {
    setIsDragging(true);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Få beholderens dimensjoner etter at komponenten er montert
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setContainerWidth(container.offsetWidth);
      setContainerHeight(container.offsetHeight);
    }
  }, []);

  return (
    <div
      className="relative rounded-lg overflow-hidden group font-['Montserrat']" //Added font-['Montserrat']
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-['Cairo'] font-bold">
        Før
      </div>
      <div className="absolute top-4 right-4 bg-[#622efd]/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-['Cairo'] font-bold">
        Etter
      </div>
      <div
        style={{
          width: "100%",
          height: "350px",
          position: "relative",
          marginTop: "-30px",
        }}
      >
        <img
          src={before}
          alt="Før"
          className="rounded-lg block absolute top-0 left-0 object-cover"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            width: "100%",
            height: "100%",
          }}
        />
        <img
          src={after}
          alt="Etter"
          className="rounded-lg block absolute top-0 left-0 object-cover"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#b896ff] left-1/2 transform -translate-x-1/2 z-10 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      ></div>
      <div
        className="absolute top-0 bottom-0 w-6 h-6 bg-white rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 0.3rem)`, top: "50%" }}
      />
    </div>
  );
};

export default Home;
