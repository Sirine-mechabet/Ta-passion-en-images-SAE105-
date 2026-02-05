console.log("test")

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function () {

    // Variable pour stocker les contributions
    let contributions = [];

    // Fonction pour créer une carte d'image
    function createImageCard(imageInfo) {
        const div = document.createElement('div');
        div.className = 'image-card';

        const figure = document.createElement('figure');

        const img = document.createElement('img');
        img.src = imageInfo.src;
        img.alt = imageInfo.alt;
        img.className = 'gallery-image';
        img.loading = 'lazy';

        // Ajouter l'événement de clic pour le zoom
        img.addEventListener('click', function () {
            openLightbox(imageInfo);
        });

        const captionTitle = document.createElement('figcaption');
        const strong = document.createElement('strong');
        strong.textContent = imageInfo.title;
        captionTitle.appendChild(strong);

        const captionCopyright = document.createElement('figcaption');
        captionCopyright.textContent = imageInfo.copyright;

        figure.appendChild(img);
        figure.appendChild(captionTitle);
        figure.appendChild(captionCopyright);
        div.appendChild(figure);

        return div;
    }

    // Fonction pour charger les images dans une galerie
    function loadGallery(sectionId, dataArray) {
        const gallery = document.getElementById(sectionId);
        if (!gallery) return;

        gallery.innerHTML = '';

        dataArray.forEach(imageInfo => {
            const card = createImageCard(imageInfo);
            gallery.appendChild(card);
        });
    }

    // Charger toutes les galeries initiales
    loadGallery('gallery-enfance', imageData.enfance);
    loadGallery('gallery-artfight', imageData.artfight2025);
    loadGallery('gallery-anciens', imageData.anciensDessins);
    loadGallery('gallery-recents', imageData.dessinsRecents);

    // LIGHTBOX - Création de la lightbox
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';

        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeLightbox);

        const img = document.createElement('img');
        img.id = 'lightbox-image';
        img.alt = '';

        const caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        caption.id = 'lightbox-caption';

        lightboxContent.appendChild(closeBtn);
        lightboxContent.appendChild(img);
        lightboxContent.appendChild(caption);
        lightbox.appendChild(lightboxContent);

        document.body.appendChild(lightbox);

        // Fermer en cliquant à l'extérieur de l'image
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Fermer avec la touche Échap
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    }

    // Fonction pour ouvrir la lightbox
    function openLightbox(imageInfo) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightbox-image');
        const caption = document.getElementById('lightbox-caption');

        img.src = imageInfo.src;
        img.alt = imageInfo.alt;
        caption.innerHTML = `
            <strong>${imageInfo.title}</strong><br>
            <p>${imageInfo.description}</p>
            <small>${imageInfo.copyright}</small>
        `;

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Fonction pour fermer la lightbox
    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Créer la lightbox au chargement
    createLightbox();

    // GESTION DU FORMULAIRE CONTRIBUTIF
    const form = document.getElementById('contribution-form');
    const previewSection = document.getElementById('preview-section');
    const previewContainer = document.getElementById('preview-container');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    let currentPreview = null; // Stocke la prévisualisation actuelle

    // Soumission du formulaire pour prévisualisation
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Récupérer les valeurs du formulaire
            const urlSource = document.getElementById('url-source').value.trim();
            const titre = document.getElementById('titre').value.trim();
            const description = document.getElementById('description').value.trim();
            const auteur = document.getElementById('auteur').value.trim();

            // Validation basique
            if (!urlSource || !titre || !description || !auteur) {
                alert('Tous les champs sont obligatoires !');
                return;
            }

            // Créer l'objet de données
            currentPreview = {
                src: urlSource,
                alt: titre,
                title: titre,
                description: description,
                copyright: `© ${auteur}`
            };

            // Afficher la prévisualisation
            showPreview(currentPreview);
        });
    }

    // Fonction pour afficher la prévisualisation
    function showPreview(imageInfo) {
        previewContainer.innerHTML = '';

        // Créer l'aperçu
        const previewCard = createImageCard(imageInfo);
        previewContainer.appendChild(previewCard);

        // Afficher la section de prévisualisation
        previewSection.style.display = 'block';

        // Scroller jusqu'à la prévisualisation
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Bouton Confirmer
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (currentPreview) {
                // Ajouter à la liste des contributions
                contributions.push(currentPreview);

                // Recharger la galerie des contributions
                loadGallery('gallery-contributions', contributions);

                // Afficher la section des contributions si elle était cachée
                const contributionsContainer = document.getElementById('gallery-contributions-container');
                if (contributionsContainer) {
                    contributionsContainer.style.display = 'block';
                }

                // Réinitialiser le formulaire
                form.reset();

                // Cacher la prévisualisation
                previewSection.style.display = 'none';
                currentPreview = null;

                // Message de confirmation
                alert('Ton dessin a été ajouté avec succès ! Merci pour ta contribution');

                // Scroller jusqu'à la galerie des contributions
                contributionsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Bouton Annuler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            // Cacher la prévisualisation
            previewSection.style.display = 'none';
            currentPreview = null;

            // Optionnel : scroller jusqu'au formulaire
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});