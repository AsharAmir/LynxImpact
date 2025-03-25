import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload as UploadIcon,
  Loader,
  Camera,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import clsx from "clsx";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [enhancementType, setEnhancementType] = useState<
    "exterior" | "interior"
  >("exterior");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setEnhancedImage(null);
    setError(null);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const handleEnhance = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    // Simuler fremgang
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint =
        enhancementType === "exterior"
          ? "http://localhost:5000/api/enhanceExterior"
          : "http://localhost:5000/api/enhanceInterior";

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
      });

      setProgress(100);

      if (response.data && response.data.image) {
        setEnhancedImage(`data:image/png;base64,${response.data.image}`);
      } else {
        setError("Kunne ikke hente forbedret bildedata.");
      }
    } catch (error) {
      console.error("Feil ved forbedring av bilde:", error);
      setError("Kunne ikke forbedre bildet. Vennligst prøv igjen.");
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a2a] text-white pt-24 font-['Montserrat']">
      {" "}
      {/* Apply Montserrat to the whole page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Valg av forbedringstype */}
          <div className="mb-6 flex justify-center">
            <select
              value={enhancementType}
              onChange={(e) =>
                setEnhancementType(e.target.value as "exterior" | "interior")
              }
              className="bg-[#0b0e26] text-gray-300 p-2 rounded-lg border border-[#622efd]/20 font-['Cairo']" // Cairo for select
            >
              <option value="exterior" className="font-['Cairo']">
                Utvendig bilde
              </option>{" "}
              {/* Cairo for options */}
              <option value="interior" className="font-['Cairo']">
                Innvendig bilde
              </option>{" "}
              {/* Cairo for options */}
            </select>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-['Cairo']">
              {" "}
              {/* Cairo Bold for H1 */}
              <span className="bg-gradient-to-r from-[#b896ff] to-[#622efd] bg-clip-text text-transparent">
                Transformer bildet dine
              </span>
            </h1>
            <p className="text-lg">
              Last opp bildet ditt og la vår AI forbedre det til studiokvalitet
              på sekunder
            </p>
          </div>

          {/* Opplastingsområde */}
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={clsx(
                "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all backdrop-blur-sm",
                {
                  "border-[#622efd] bg-[#622efd]/10": isDragActive,
                  "border-[#b896ff]/50 hover:border-[#622efd] bg-[#0b0e26]":
                    !isDragActive,
                }
              )}
            >
              <input {...getInputProps()} />
              <Camera className="mx-auto h-16 w-16 text-[#b896ff] mb-6" />
              <p className="text-xl mb-2 font-['Cairo']">
                {" "}
                {/* Cairo for dropzone text */}
                {isDragActive
                  ? "Slipp bildet ditt her"
                  : "Dra og slipp bilbildet ditt her"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                eller klikk for å velge fra datamaskinen din
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>Maksimal filstørrelse: 10MB</span>
                <span>|</span>
                <span>Støttede formater: JPG, PNG</span>
              </div>
            </div>
          </div>

          {/* Feilmelding */}
          {error && (
            <div className="mb-8 p-6 bg-red-900/50 border border-red-700/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          )}

          {/* Forhåndsvisning og prosessering */}
          {preview && (
            <div className="space-y-8">
              <div className="bg-[#0b0e26] p-8 rounded-2xl border border-[#622efd]/20">
                {enhancedImage ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold font-['Cairo']">
                        {" "}
                        {/* Cairo Bold for H3 */}
                        Sammenlign resultater
                      </h3>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-green-500 font-['Cairo']">
                          {" "}
                          {/* Cairo Bold for completion text */}
                          Forbedring fullført
                        </span>
                      </div>
                    </div>
                    <div className="aspect-[16/9]">
                      <ReactCompareSlider
                        itemOne={
                          <ReactCompareSliderImage
                            src={preview}
                            alt="Original"
                            className="object-cover"
                          />
                        }
                        itemTwo={
                          <ReactCompareSliderImage
                            src={enhancedImage}
                            alt="Forbedret"
                            className="object-cover"
                          />
                        }
                        className="rounded-lg"
                        style={{ height: "100%" }}
                        position={50}
                      />
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <span className="text-gray-400 font-['Cairo']">
                        Original
                      </span>{" "}
                      {/* Cairo for labels */}
                      <span className="text-[#b896ff] font-['Cairo']">
                        Forbedret
                      </span>{" "}
                      {/* Cairo for labels */}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 font-['Cairo']">
                      {" "}
                      {/* Cairo Bold for H3 */}
                      Originalbilde
                    </h3>
                    <img
                      src={preview}
                      alt="Original"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </div>

              {/* Prosesseringsfremgang */}
              {loading && (
                <div className="bg-[#0b0e26] p-6 rounded-2xl border border-[#622efd]/20">
                  <div className="flex items-center gap-4 mb-4">
                    <RefreshCw className="h-5 w-5 text-[#b896ff] animate-spin" />
                    <span className="font-['Cairo']">
                      Forbedrer bildet ditt...
                    </span>{" "}
                    {/* Cairo Bold for processing text */}
                  </div>
                  <div className="h-2 bg-[#121530] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#622efd] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {progress}% fullført
                  </div>
                </div>
              )}

              {/* Handlingsknapper */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleEnhance}
                  disabled={loading}
                  className={clsx(
                    "w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 font-['Cairo'] font-bold", // Cairo Bold for button
                    {
                      "bg-[#622efd] hover:bg-[#5b29e8] text-white": !loading,
                      "bg-[#622efd]/20 cursor-not-allowed text-[#622efd]/50":
                        loading,
                    }
                  )}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" />
                      Behandler...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Forbedre bilde
                    </>
                  )}
                </button>
                {enhancedImage && (
                  <a
                    href={enhancedImage}
                    download="enhanced-car.png"
                    className="w-full sm:w-auto px-8 py-4 bg-[#0b0e26] hover:bg-[#121530] text-gray-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-[#622efd]/20 font-['Cairo'] font-bold" // Cairo Bold for download button
                  >
                    <Download className="h-5 w-5" />
                    Last ned forbedret bilde
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
