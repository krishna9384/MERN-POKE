import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Function to fetch Pokémon data
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
      const data = response.data.results;

      const imagesWithDetails = await Promise.all(
        data.map(async (pokemon) => {
          try {
            const pokemonDetails = await axios.get(pokemon.url);
            const stats = pokemonDetails.data.stats || [];
            return {
              name: pokemon.name,
              image: pokemonDetails.data.sprites?.front_default || 'https://via.placeholder.com/100',
              hp: stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 'N/A',
              attack: stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 'N/A',
              baseExperience: pokemonDetails.data.base_experience || 'N/A',
            };
          } catch (error) {
            console.error(`Error fetching details for ${pokemon.name}:`, error);
            return null;
          }
        })
      );

      setImages(imagesWithDetails.filter(Boolean).slice(0, 32));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value.toLowerCase());
  };

  const getBorderColor = (baseExperience) => {
    return baseExperience < 80 ? 'black' : '#000';
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(search)
  );

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pokémon_logo.svg"
        alt="Pokémon Logo"
        style={{ width: '150px', marginBottom: '20px' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px',
        }}
      >
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={handleSearch}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
          }}
        />
        <button
          onClick={() => console.log('Search button clicked!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Search
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
            justifyContent: 'center',
            padding: '10px',
          }}
        >
          {filteredImages.map((img, index) => (
            <div
              key={index}
              style={{
                border: `1px solid ${getBorderColor(img.baseExperience)}`,
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                backgroundColor: '#FFF7D1',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <img
                src={img.image}
                alt={img.name}
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
              <p
                style={{
                  margin: '10px 0',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textTransform: 'capitalize',
                  backgroundColor: '#ffeb3b',
                  padding: '5px',
                  borderRadius: '5px',
                }}
              >
                {img.name}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>HP:</strong> {img.hp}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Attack:</strong> {img.attack}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Base Experience:</strong> {img.baseExperience}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
