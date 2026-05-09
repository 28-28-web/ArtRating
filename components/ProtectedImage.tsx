"use client";

import { useState, useEffect } from "react";

type Props = {
  src: string;
  artId: string;
  alt: string;
};

export function ProtectedImage({ src, artId, alt }: Props) {
  const [showToast, setShowToast] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(false);

  // Generate watermark pattern
  const watermarkText = `${artId} • artrating.art`;

  // Extract public ID from Cloudinary URL
  const getPublicId = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex !== -1) {
        return pathParts.slice(uploadIndex + 1).join('/').replace(/\.[^/.]+$/, "");
      }
      return '';
    } catch {
      return '';
    }
  };

  // Fetch signed URL on component mount
  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!src || !src.includes('cloudinary')) {
        return; // Skip if not a Cloudinary URL
      }

      setIsLoading(true);
      try {
        const publicId = getPublicId(src);
        if (!publicId) {
          console.warn('Could not extract public ID from URL');
          return;
        }

        const response = await fetch('/api/signed-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicId,
            artId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSignedUrl(data.url);
          
          // Set up refresh before expiry (4.5 minutes)
          const refreshTimer = setTimeout(() => {
            fetchSignedUrl();
          }, 4.5 * 60 * 1000);

          return () => clearTimeout(refreshTimer);
        }
      } catch (error) {
        console.error('Failed to fetch signed URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignedUrl();
  }, [src, artId]);
  
  // Handle copy attempts
  const handleCopyAttempt = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Handle drag attempts
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Handle select start
  const handleSelectStart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Add global event listeners for copy attempts
  useEffect(() => {
    const handleGlobalCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        // Check if selection contains image-related content
        const selectedText = selection.toString().toLowerCase();
        if (selectedText.includes('artrating.art') || selectedText.includes(artId.toLowerCase())) {
          e.preventDefault();
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+A, Ctrl+S, F12
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 's')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        if (e.ctrlKey && e.key === 'c') {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      }
    };

    document.addEventListener('copy', handleGlobalCopy);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleGlobalCopy);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [artId]);

  return (
    <>
      <div
        className="relative select-none rounded-xl border border-white/10 p-[2px] bg-gradient-to-r from-violet-500/70 via-fuchsia-500/60 to-amber-400/60 shadow-[0_0_30px_rgba(124,58,237,0.18)] pointer-events-none animate-[framePulse_3.2s_ease-in-out_infinite"
        onContextMenu={handleContextMenu}
        onCopy={handleCopyAttempt}
        onDragStart={handleDragStart}
        draggable={false}
      >
        <div className="relative overflow-hidden rounded-[10px] bg-[#0a0a0a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {isLoading ? (
            <div className="w-full h-48 rounded-[10px] bg-gray-800 flex items-center justify-center">
              <div className="text-white text-sm">Loading...</div>
            </div>
          ) : (
            <img
              src={signedUrl}
              alt={alt}
              className="w-full rounded-[10px] pointer-events-none select-none"
              draggable={false}
              onDragStart={handleDragStart}
              onContextMenu={handleContextMenu}
              onCopy={handleCopyAttempt}
              style={{
                WebkitUserSelect: 'none',
                KhtmlUserDrag: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent'
              } as React.CSSProperties}
            />
          )}
          
          {/* Diagonal Watermark Overlay */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255, 255, 255, 0.15) 20px,
                rgba(255, 255, 255, 0.15) 40px
              )`,
              backgroundSize: '200px 200px'
            }}
          >
            {/* Watermark Text Pattern */}
            <div 
              className="absolute inset-0 flex flex-wrap items-center justify-center pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='rgba(255,255,255,0.15)' text-anchor='middle' dominant-baseline='middle' transform='rotate(-45 100 100)'%3E${encodeURIComponent(watermarkText)}%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '200px 200px',
                opacity: 0.15
              }}
            />
          </div>

          {/* Invisible overlay to block interactions */}
          <div 
            className="absolute inset-0 z-20 bg-transparent cursor-default"
            onContextMenu={handleContextMenu}
            onCopy={handleCopyAttempt}
            onDragStart={handleDragStart}
          />
          
          {/* Bottom watermark */}
          <div className="absolute bottom-2 right-2 z-30 rounded bg-black/60 px-2 py-1 text-xs text-white/80 select-none pointer-events-none">
            {artId} • artrating.art
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm font-medium">এই ছবি সুরক্ষিত। শেয়ার করতে Share বাটন ব্যবহার করুন।</span>
        </div>
      )}
    </>
  );
}
