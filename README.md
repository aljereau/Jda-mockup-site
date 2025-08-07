# JDA Website - Scroll-Linked Video Hero

Een moderne website met scroll-gecontroleerde video achtergrond voor JDA Local AI implementaties.

## 🎬 Functies

### Scroll-Linked Video
- **Video achtergrond**: `Rotating Hand V1.mp4` speelt af gebaseerd op scroll positie
- **Synchrone playback**: Video speelt sneller/langzamer op basis van scroll snelheid
- **Vloeiende animaties**: Professionele overgangen tussen secties

### Dynamische Navigatie
- **Auto-collapse**: Menu klapt in zodra je begint te scrollen
- **Hover card**: Witte kaart verschijnt achter tekst bij hover (alleen in collapsed state)
- **Logo integratie**: JDA logo onderdeel van de hover kaart

### Hero Sectie
- **Fade animatie**: Hero tekst en message box verdwijnen geleidelijk tijdens scrollen
- **Message input**: Geïntegreerde chat input onderaan hero tekst
- **Responsive design**: Werkt op alle schermformaten

### Tweede Sectie
- **"Our AI Solutions"**: Verschijnt vanaf 40% scroll progress
- **Talk to Jade knop**: Grote, prominente chat knop
- **Rechts-uitgelijnd**: Tekst en content positionering aan rechterkant

## 🛠️ Technologie Stack

- **React 18** - UI framework
- **Vite** - Development en build tool
- **Three.js & React Three Fiber** - 3D graphics (voor toekomstige uitbreidingen)
- **CSS3** - Geavanceerde animaties en styling
- **HTML5 Video** - Scroll-linked video playback

## 📁 Project Structuur

```
JDA Website mock up/
├── src/
│   ├── ScrollVideoHero.jsx     # Hoofdcomponent
│   ├── ScrollVideoHero.css     # Styling en animaties
│   ├── App.jsx                 # App wrapper
│   ├── App.css                 # Basis styling
│   └── main.jsx               # React entry point
├── Videos/
│   └── Rotating Hand V1.mp4   # Scroll-linked achtergrond video
├── Images/                     # Statische afbeeldingen
├── package.json               # Dependencies
└── vite.config.js             # Vite configuratie
```

## 🚀 Installatie & Setup

### Vereisten
- Node.js (versie 16 of hoger)
- npm of yarn

### Stappen
1. Clone de repository
```bash
git clone [repository-url]
cd "JDA Website mock up"
```

2. Installeer dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open browser naar `http://localhost:5173` (of getoonde poort)

## 🎯 Kern Functionaliteiten

### Video Scroll Sync
De video playback is gekoppeld aan scroll positie:
- 0% scroll = video begin
- 100% scroll = video einde
- Scroll snelheid = video playback snelheid

### Animatie Timing
- **0% scroll**: Volledige hero zichtbaar, menu volledig
- **>0% scroll**: Menu klapt in
- **0-100% scroll**: Hero fade out + video playback
- **40-100% scroll**: Tweede sectie fade in
- **Hover**: Witte kaart achter collapsed menu

### Responsive Breakpoints
- **Desktop**: Volledige layout
- **Tablet** (≤768px): Compacte navigatie
- **Mobile** (≤480px): Geoptimaliseerde layout

## 🎨 Design Principes

- **Glassmorphism**: Transparante elementen met blur effecten
- **Smooth animations**: 60fps animaties met hardware acceleratie
- **Scroll-driven**: Alle interacties gebaseerd op scroll gedrag
- **Minimalistisch**: Clean, professionele uitstraling

## 📱 Browser Ondersteuning

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run preview` - Preview productie build

### Performance Optimalisaties
- RequestAnimationFrame voor scroll events
- Video tijd updates via RAF
- CSS will-change properties
- Throttled scroll listeners

## 📄 Licentie

Dit project is ontwikkeld voor JDA Local AI implementations.

---

*Gebouwd met ❤️ voor moderne web experiences*
