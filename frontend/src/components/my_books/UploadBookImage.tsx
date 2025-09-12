"use client";

import { Button } from "@/components/ui/button";
import { LocaleDict } from "@/lib/locales";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function UploadBookImage({
  imageFile,
  setImageFile,
  imageURL,
  translations,
}: {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageURL?: string | null;
  translations: LocaleDict;
}) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate preview URL
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    if (imageFile.size > 4 * 1024 * 1024) {
      const errorMsg = translations.page.home.bookForm.imageUploadSizeError;
      setError(errorMsg);
      toast.error(errorMsg);
      setImageFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile, setImageFile]);


  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // This triggers the preview and validation
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setError(null);
  };

  const fileName = useMemo(() => {
    if (!imageFile) return "";
    return imageFile.name.length > 20
      ? `${imageFile.name.slice(0, 20)}...`
      : imageFile.name;
  }, [imageFile]);

  const fileSize = useMemo(() => {
    if (!imageFile) return "";
    return `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`;
  }, [imageFile]);

  return (
    <div className="flex flex-col space-y-2 col-span-2">
      <label className="form-label" htmlFor="image">
        {translations.page.home.bookForm.uploadBookImageTitle}
      </label>
      <div
        className="h-[150px] w-full hover:cursor-pointer hover:bg-secondary/5 border-2 border-secondary border-dashed rounded-sm p-4"
        onClick={handleClick}
      >
        <input
          name="image"
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/jpeg, image/png"
        />
        <div className="flex flex-col items-center justify-center w-full">
          {previewUrl || imageURL ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative">
                <Image
                  width={56}
                  height={56}
                  src={previewUrl ?? imageURL ?? "/assets/books/book-placeholder.png"}
                  alt="preview"
                  className="w-20 h-20 rounded-md shadow-md object-contain border"
                />
                <Button
                  variant="link"
                  className="absolute -top-3 -right-8 text-destructive"
                  onClick={handleRemoveFile}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-primary font-medium">{fileName}</p>
                <p className="text-xs text-primary font-medium">{fileSize}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-7 w-7 text-primary" />
              <div className="flex flex-col items-center justify-center text-secondary space-y-2">
                <p className="text-sm underline underline-offset-4 text-primary">
                  {translations.page.home.bookForm.uploadBookImageTitle}
                </p>
                <p className="text-xs text-primary/50">
                  {translations.page.home.bookForm.imageFormatsAndSize}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
