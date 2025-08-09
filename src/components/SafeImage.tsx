"use client";
import Image from "next/image";
import React from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string; // classes appliquées au conteneur
  imgClassName?: string; // classes appliquées à l'image en avant-plan
  priority?: boolean;
  sizes?: string;
};

/**
 * SafeImage: évite le recadrage en affichant l'image en object-contain
 * et ajoute un arrière-plan flouté (object-cover) pour remplir l'espace.
 * Le parent doit définir la taille (classes de largeur/hauteur) et être positionné en "relative".
 */
export default function SafeImage({ src, alt, className = "", imgClassName = "", priority = false, sizes }: SafeImageProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Arrière-plan flouté */}
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover w-full h-full scale-110 blur-xl opacity-60"
        priority={priority}
      />
      {/* Image principale sans recadrage */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain w-full h-full ${imgClassName}`}
        priority={priority}
      />
    </div>
  );
}