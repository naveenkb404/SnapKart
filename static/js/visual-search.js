/**
 * SnapKart Visual Search Engine
 * Features:
 * - Real camera capture via navigator.mediaDevices.getUserMedia (with fallback simulation)
 * - File drag-and-drop & image upload preview
 * - Separation of Exact-Match results vs Visually-Similar alternatives
 * - Clearly marked demonstration data disclaimer
 */

const SnapSearch = (function() {
  'use strict';

  let videoStream = null;
  let activeQueryKey = 'headphones';

  // Available demonstration queries with graceful fallback
  function getDemoCatalog() {
    return (typeof SnapData !== 'undefined' && SnapData.visualSearchDemoCatalog) ? SnapData.visualSearchDemoCatalog : {};
  }

  function init() {
    initDropzones();
  }

  function initDropzones() {
    const dropzone = document.getElementById('snap-dropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--color-secondary)';
        dropzone.style.backgroundColor = '#FFF2EA';
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        dropzone.style.backgroundColor = '';
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleImageFile(files[0]);
      }
    });
  }

  /* ==========================================================================
     1. Live Camera Stream & Capture Interface
     ========================================================================== */
  async function startCamera(videoElementId = 'camera-video-stream') {
    const video = document.getElementById(videoElementId);
    const cameraBox = document.getElementById('camera-viewfinder');
    const fallbackBox = document.getElementById('camera-fallback-msg');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (fallbackBox) {
        fallbackBox.style.display = 'block';
        fallbackBox.textContent = 'Camera API is not supported by this browser. Please upload a photo or try sample snaps.';
      }
      SnapKart.showToast('Camera stream not supported in this browser environment. Using demo photo simulation.', 'info');
      return false;
    }

    try {
      stopCamera(); // clear previous
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      videoStream = stream;
      if (video) {
        video.srcObject = stream;
        video.play();
        video.style.display = 'block';
      }
      if (fallbackBox) fallbackBox.style.display = 'none';
      SnapKart.showToast('Camera active! Point at any product and press the snap button.', 'success');
      return true;
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      if (fallbackBox) {
        fallbackBox.style.display = 'block';
        fallbackBox.innerHTML = `
          <div style="padding:1rem; text-align:center;">
            <p style="color:#CBD5E1; margin-bottom:8px;">📷 Live webcam is unavailable or permission was not granted.</p>
            <p class="text-xs text-muted">You can test the visual engine by selecting sample queries or uploading an image.</p>
          </div>
        `;
      }
      return false;
    }
  }

  function stopCamera() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
  }

  function captureSnapshot() {
    const video = document.getElementById('camera-video-stream');
    const previewCanvas = document.getElementById('camera-capture-canvas');

    if (video && video.videoWidth > 0 && previewCanvas) {
      previewCanvas.width = video.videoWidth;
      previewCanvas.height = video.videoHeight;
      const ctx = previewCanvas.getContext('2d');
      ctx.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
      stopCamera();
      runRecognitionAnalysis(activeQueryKey, previewCanvas.toDataURL());
    } else {
      // Simulate snapshot shutter
      SnapKart.showToast('📸 Snapshot captured! Analyzing visual contours...', 'info');
      runRecognitionAnalysis(activeQueryKey);
    }
  }

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      SnapKart.showToast('Please select a valid image file (JPG, PNG, WEBP)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('uploaded-preview-img');
      if (previewImg) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      }
      SnapKart.showToast(`Analyzing uploaded image: ${file.name}...`, 'info');
      runRecognitionAnalysis(activeQueryKey, e.target.result);
    };
    reader.readAsDataURL(file);
  }

  /* ==========================================================================
     2. Visual Recognition Simulation & Result Rendering
     ========================================================================== */
  function runRecognitionAnalysis(queryKey = 'headphones', customImageSrc = null) {
    activeQueryKey = queryKey;
    const scannerView = document.getElementById('snap-scanner-view');
    const resultsContainer = document.getElementById('snap-results-view');

    if (!scannerView || !resultsContainer) return;

    // Show simulated AI neural processing state
    scannerView.innerHTML = `
      <div style="padding: 2.5rem 1rem; text-align: center;">
        <div style="display:inline-block; width:52px; height:52px; border:4px solid var(--color-border); border-top-color:var(--color-secondary); border-radius:50%; animation: spin 0.8s linear infinite;"></div>
        <h4 style="margin-top: 1rem; color: var(--color-primary); font-weight:800;">Visual Neural Engine Ingesting Image...</h4>
        <p class="text-sm text-muted">Extracting edges, textures, brand contours, and running hyperlocal geospatial distance matching.</p>
        <span class="badge badge-orange" style="margin-top:8px;">⚡ Hardware-Accelerated Vector Search</span>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;

    setTimeout(() => {
      renderResults(queryKey, customImageSrc);
    }, 1200);
  }

  function renderResults(queryKey, customImageSrc) {
    const scannerView = document.getElementById('snap-scanner-view');
    const resultsContainer = document.getElementById('snap-results-view');
    const catalog = getDemoCatalog();
    const matchData = catalog[queryKey] || catalog.headphones || {
      queryTitle: 'Visual Search Query',
      detectedCategory: 'General Merchandise',
      confidence: '95.0%',
      exactMatches: [{
        productId: 'prod-1',
        name: 'Matched Hyperlocal Product',
        brand: 'Local Brand',
        similarityScore: '96.5%',
        lowestPrice: 49.99,
        availableShopsCount: 2,
        eta: 'Direct Store Delivery',
        image: '../../static/images/placeholder.svg'
      }],
      similarMatches: []
    };

    if (!scannerView || !resultsContainer) return;

    // Reset scanner box to ready status
    scannerView.innerHTML = `
      <div style="background: #FFF8F3; border: 1.5px solid var(--color-secondary); border-radius: var(--radius-lg); padding: 1rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">📷</span>
          <div>
            <div style="font-weight:800; color:var(--color-primary); font-size:14px;">Query Detected: ${matchData.queryTitle}</div>
            <span class="text-xs text-muted">Category: <strong>${matchData.detectedCategory}</strong> • Visual Confidence: <strong>${matchData.confidence}</strong></span>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="SnapSearch.startCamera()">Retake Photo</button>
      </div>
    `;

    // Render Exact Match and Visually Similar Columns with Clear Demonstration Notice
    resultsContainer.innerHTML = `
      <!-- Demonstration Notice -->
      <div class="demo-data-disclaimer">
        <span>⚠️</span>
        <span>${SnapData.demoDisclaimer}</span>
      </div>

      <div class="match-columns-grid">
        <!-- Column 1: EXACT LOCAL MATCHES (100% Identical SKU) -->
        <div class="card p-4" style="border: 2px solid var(--color-success); background: #FAFDFB;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.75rem;">
            <span class="badge badge-success">✨ Exact Visual SKU Match (${matchData.exactMatches[0].similarityScore})</span>
            <span class="text-xs font-semibold text-muted">100% Confirmed</span>
          </div>

          ${matchData.exactMatches.map(exact => `
            <div style="display:flex; gap:var(--space-3); margin-bottom: var(--space-3);">
              <img src="${customImageSrc || exact.image}" alt="${exact.name}" style="width:72px; height:72px; border-radius:var(--radius-md); object-fit:cover; background:#E2E8F0; border:1px solid var(--color-border);">
              <div style="flex-grow:1;">
                <h4 style="font-size:var(--font-size-sm); color:var(--color-primary); margin-bottom:2px;">${exact.name}</h4>
                <div class="text-xs text-muted">Brand: <strong>${exact.brand}</strong></div>
                <div class="text-xs" style="color:var(--color-secondary); font-weight:700; margin-top:2px;">
                  📍 Available at ${exact.availableShopsCount} nearby stores • Delivery in ${exact.eta}
                </div>
              </div>
            </div>

            <!-- Price & Actions -->
            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px dashed var(--color-border); padding-top:0.75rem;">
              <div>
                <span style="font-size:var(--font-size-xl); font-weight:800; color:var(--color-primary);">$${exact.lowestPrice.toFixed(2)}</span>
                <span class="badge badge-orange" style="font-size:10px; margin-left:4px;">Lowest Price</span>
              </div>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-outline btn-sm" onclick="CustomerUI.openProductDetail('${exact.productId}')">
                  Compare Stores
                </button>
                <button class="btn btn-secondary btn-sm" onclick="SnapSearch.quickAddToCart('${exact.productId}')">
                  + Add to Cart
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Column 2: VISUALLY SIMILAR ALTERNATIVE PRODUCTS -->
        <div class="card p-4" style="border: 1px solid var(--color-border); background: var(--color-surface);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.75rem;">
            <span class="badge badge-neutral">👁️ Visually Similar Items</span>
            <span class="text-xs text-muted">${matchData.similarMatches.length} alternatives</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${matchData.similarMatches.map(sim => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:8px; border-radius:var(--radius-md); background:var(--color-surface-alt); border:1px solid var(--color-border);">
                <div>
                  <h5 style="font-size:12px; margin-bottom:2px; color:var(--color-primary);">${sim.name}</h5>
                  <span class="text-xs text-muted">${sim.matchType} • <strong>${sim.similarityScore}</strong></span>
                  <div style="font-weight:700; font-size:12px; color:var(--color-text); margin-top:2px;">$${sim.price.toFixed(2)}</div>
                </div>
                <button class="btn btn-outline-primary btn-sm" style="font-size:11px; padding:0.25rem 0.5rem;" onclick="SnapKart.showToast('Viewing alternative: ${sim.name}', 'info')">
                  View
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    SnapKart.showToast(`Found exact match and ${matchData.similarMatches.length} visual alternatives!`, 'success');
  }

  function quickAddToCart(productId) {
    const prod = SnapData.products.find(p => p.id === productId);
    if (!prod) return;
    const lowestShop = prod.shopPrices[0];
    CustomerStore.addToCart(prod, lowestShop.shopId, lowestShop.price);
  }

  return {
    init,
    startCamera,
    stopCamera,
    captureSnapshot,
    handleImageFile,
    runRecognitionAnalysis,
    quickAddToCart
  };
})();

window.SnapSearch = SnapSearch;
