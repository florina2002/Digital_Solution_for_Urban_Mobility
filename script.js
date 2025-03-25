const locations = ["Iulius"];
let selectedLocation = "";
let currentSelectedRoute = null;

const bottomBar = document.querySelector('.bottom-bar');
const dragHandle = document.querySelector('.bottom-bar-header');
let isDragging = false;
let startY;
let startHeight;


bottomBar.style.height = '30%';

function initDrag(e) {
    isDragging = true;
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(bottomBar).height, 10);
    dragHandle.style.cursor = 'grabbing';
}

function doDrag(e) {
    if (!isDragging) return;

    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const deltaY = startY - currentY;
    const newHeight = Math.min(Math.max(startHeight + deltaY, 100), window.innerHeight * 0.8);

    bottomBar.style.height = `${newHeight}px`;
    e.preventDefault();
}

function stopDrag() {
    isDragging = false;
    dragHandle.style.cursor = 'grab';
}

dragHandle.addEventListener('mousedown', initDrag);
document.addEventListener('mousemove', doDrag);
document.addEventListener('mouseup', stopDrag);

dragHandle.addEventListener('touchstart', initDrag);
document.addEventListener('touchmove', doDrag);
document.addEventListener('touchend', stopDrag);

function selectRoute(imagePath, route) {
    const appBackground = document.querySelector('.background');
    const clickedRoute = event.currentTarget;

    if (clickedRoute === currentSelectedRoute) {
        clickedRoute.classList.remove('selected');
        appBackground.style.backgroundImage = '';
        currentSelectedRoute = null;
    } else {
        if (currentSelectedRoute) {
            currentSelectedRoute.classList.remove('selected');
        }

        clickedRoute.classList.add('selected');
        appBackground.style.backgroundImage = `url('${imagePath}')`;
        currentSelectedRoute = clickedRoute;
    }
}

function handleBikeRoute(imagePath) {
    const clickedRoute = event.currentTarget;

    if (clickedRoute === currentSelectedRoute) {
        clickedRoute.classList.remove('selected');
        document.querySelector('.background').style.backgroundImage = '';
        currentSelectedRoute = null;
        return;
    }

    selectRoute(imagePath);
    showBikeReservation();
}

function handlePublicTransport(imagePath) {
    const clickedRoute = event.currentTarget;

    if (clickedRoute === currentSelectedRoute) {
        clickedRoute.classList.remove('selected');
        document.querySelector('.background').style.backgroundImage = '';
        currentSelectedRoute = null;
        return;
    }

    selectRoute(imagePath);
    showTransportStatus();
}

function showTransportStatus() {
    const modal = document.getElementById('transportStatusModal');
    modal.classList.remove('hidden');
    startRealTimeUpdates();
}

let updateInterval;

function startRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    updateInterval = setInterval(() => {
        const updates = document.querySelector('.real-time-updates');
        const time = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });

        const updateMessages = [
            'Bus arriving at station',
            'Slight traffic delay',
            'Bus departed from station',
            'On schedule'
        ];

        const randomUpdate = updateMessages[Math.floor(Math.random() * updateMessages.length)];

        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.innerHTML = `
            <span class="update-time">${time}</span>
            <span class="update-text">${randomUpdate}</span>
        `;

        updates.insertBefore(updateItem, updates.querySelector('.update-item'));
    }, 30000);
}

function showBikeReservation() {
    const modal = document.getElementById('bikeReservationModal');
    modal.classList.remove('hidden');
}

let reservationTimer;

function reserveBike(bikeNumber) {
    closeModal('bikeReservationModal');

    const confirmModal = document.getElementById('reservationConfirmModal');
    confirmModal.classList.remove('hidden');

    let timeLeft = 600;
    const timerDisplay = document.getElementById('timer');

    clearInterval(reservationTimer);

    reservationTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(reservationTimer);
            closeModal('reservationConfirmModal');
            alert('Reservation time expired!');
        }
    }, 1000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
}

function toggleFilters() {
    const filters = document.getElementById('filters');
    filters.classList.toggle('hidden');
}

function updateRoutes() {
    const filters = Array.from(document.querySelectorAll('input[name="filter"]:checked')).map(
        checkbox => checkbox.value
    );

    document.querySelectorAll('.route').forEach(routeElement => {
        const shouldShow = filters.length === 0 ||
            (filters.includes('environmental-friendly') && routeElement.querySelector('.tag.ENV')) ||
            (filters.includes('easily-accessible') && routeElement.querySelector('.tag.ACC'));

        routeElement.style.display = shouldShow ? 'block' : 'none';
    });
}

function openReportWindow() {
    document.getElementById('reportWindow').classList.remove('hidden');
}

function closeReportWindow() {
    document.getElementById('reportWindow').classList.add('hidden');
}

function handleCarRoute(imagePath) {
    const clickedRoute = event.currentTarget;

    if (clickedRoute === currentSelectedRoute) {
        clickedRoute.classList.remove('selected');
        document.querySelector('.background').style.backgroundImage = '';
        currentSelectedRoute = null;
        return;
    }

    selectRoute(imagePath);
    showCarSelection();
}

function showCarSelection() {
    const modal = document.getElementById('carSelectionModal');
    modal.classList.remove('hidden');
}

function selectCar(carId) {
    closeModal('carSelectionModal');
    showCarChecklist();
}

function showCarChecklist() {
    const modal = document.getElementById('carChecklistModal');
    modal.classList.remove('hidden');
}

function updateChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const totalItems = checklistItems.length;
    const checkedItems = Array.from(checklistItems).filter(item => item.checked).length;

    const progress = (checkedItems / totalItems) * 100;
    document.getElementById('checklistProgress').style.width = `${progress}%`;
    document.getElementById('checklistStatus').textContent = `${checkedItems}/${totalItems} completed`;

    document.getElementById('startRideBtn').disabled = checkedItems !== totalItems;
}

function startRide() {
    closeModal('carChecklistModal');
    showCarAccess();
}

function showCarAccess() {
    const modal = document.getElementById('carAccessModal');
    modal.classList.remove('hidden');
}


function showEcoFriendlyComparison() {
    const modal = document.getElementById('ecoFriendlyModal');
    modal.classList.remove('hidden');

    const transportOptions = [
        { mode: 'Bike', time: '13 min', footprint: '0 kg CO2', efficiency: 'High', color: 'green' },
        { mode: 'Walking', time: '27 min', footprint: '0 kg CO2', efficiency: 'Very High', color: 'green' },
        { mode: 'Public Transit', time: '15 min', footprint: '0.2 kg CO2', efficiency: 'Medium', color: 'yellow' }
    ];

    const container = document.getElementById('ecoComparisonContainer');
    container.innerHTML = '';

    transportOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'eco-option';
        optionElement.style.borderLeft = `5px solid ${option.color}`;
        optionElement.innerHTML = `
            <h3>${option.mode}</h3>
            <p>Time: ${option.time}</p>
            <p>Carbon Footprint: ${option.footprint}</p>
            <p>Efficiency: ${option.efficiency}</p>
        `;
        container.appendChild(optionElement);
    });
}

function closeEcoFriendlyModal() {
    document.getElementById('ecoFriendlyModal').classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
    const compareButton = document.createElement('button');
    compareButton.textContent = 'Compare Eco-Friendly Travel Options';
    compareButton.className = 'eco-compare-button';
    compareButton.onclick = showEcoFriendlyComparison;
    document.querySelector('.bottom-bar-content').appendChild(compareButton);
});


function showTravelHistoryReport() {
    const modal = document.getElementById('travelHistoryModal');
    modal.classList.remove('hidden');

    const travelData = [
        { mode: 'Bike', trips: 15, distance: '50 km', emissions: '0 kg CO2' },
        { mode: 'Walking', trips: 10, distance: '30 km', emissions: '0 kg CO2' },
        { mode: 'Public Transit', trips: 20, distance: '100 km', emissions: '4 kg CO2' }
    ];

    const container = document.getElementById('travelHistoryContainer');
    container.innerHTML = '';

    travelData.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.className = 'travel-history-item';
        tripElement.innerHTML = `
            <h3>${trip.mode}</h3>
            <p>Total Trips: ${trip.trips}</p>
            <p>Total Distance: ${trip.distance}</p>
            <p>CO2 Emissions: ${trip.emissions}</p>
        `;
        container.appendChild(tripElement);
    });
}

function closeTravelHistoryModal() {
    document.getElementById('travelHistoryModal').classList.add('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
    const bottomBarContent = document.querySelector('.bottom-bar-content');

    if (!bottomBarContent) {
        console.error("Error: .bottom-bar-content not found in the DOM!");
        return;
    }

    const reportButton = document.createElement('button');
    reportButton.textContent = 'View Travel History Report';
    reportButton.className = 'travel-history-button';
    reportButton.onclick = showTravelHistoryReport;
    bottomBarContent.appendChild(reportButton);
});

function openReportIssueModal() {
    document.getElementById('reportIssueModal').classList.remove('hidden');
}

function closeReportIssueModal() {
    document.getElementById('reportIssueModal').classList.add('hidden');
}

function submitIssueReport() {
    const issueType = document.getElementById('issueType').value;
    const description = document.getElementById('issueDescription').value;
    const photo = document.getElementById('issuePhoto').files[0];

    if (!description) {
        alert("Please enter a description.");
        return;
    }

    alert(`Issue reported: ${issueType}\nDescription: ${description}`);

    closeReportIssueModal();
}

function openTripShareModal() {
    document.getElementById('tripShareModal').classList.remove('hidden');
}

function closeTripShareModal() {
    document.getElementById('tripShareModal').classList.add('hidden');
}

function generateTripShareLink() {
    const tripName = document.getElementById('tripName').value || "Group Outing";
    const tripDetails = document.getElementById('tripDetails').value || "Meeting at 6PM, using public transport";
    const shareMethod = document.getElementById('shareMethod').value;

    if (!tripDetails.trim()) {
        alert("Please enter trip details before sharing.");
        return;
    }

    const shareLink = `https://ecoapp.com/share?trip=${encodeURIComponent(tripName)}`;

    document.getElementById('tripShareLink').value = shareLink;
    document.getElementById('tripShareLinkContainer').classList.remove('hidden');

    alert(`Trip shared successfully via ${shareMethod}!`);
}

function copyTripShareLink() {
    const shareLinkInput = document.getElementById('tripShareLink');
    shareLinkInput.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}



