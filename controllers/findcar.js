const axios = require('axios');
const delay = ms => new Promise(res => setTimeout(res, ms));

const userAgents = [
  // Mobile and Desktop User Agents (increased mobile presence)
  'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.92 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; SAMSUNG SM-A107F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.5999.224 Safari/537.36'
];

const getRandomHeader = () => {
  return {
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': Math.random() > 0.5 ? 'application/json,text/html' : 'application/json',
    'Accept-Language': Math.random() > 0.5 ? 'en-US,en;q=0.9' : 'en-GB,en;q=0.8',
    'Connection': Math.random() > 0.5 ? 'keep-alive' : 'close',
    'Referer': 'https://www.spinny.com/',
    'Origin': 'https://www.spinny.com'
  };
};

exports.getFilteredCars = async (req, res) => {
  let { model, make_year, variant } = req.body;

  if (!model || !make_year) {
    return res.status(400).json({ error: 'Please provide model and make_year' });
  }

  model = model.toLowerCase();
  variant = variant?.toLowerCase();

  const cities = [
    'delhi', 'noida', 'ghaziabad', 'faridabad', 'gurgaon',
    'bangalore', 'hyderabad', 'mumbai', 'pune',
    'ahmedabad', 'chennai', 'kolkata', 'lucknow', 'jaipur',
    'chandigarh', 'coimbatore', 'karnal', 'kochi', 'sonipat'
  ];

  const filtered = [];

  try {
    for (const city of cities) {
      let page = 1;
      while (true) {
        const url = `https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&country_code=in&url=` +
          encodeURIComponent(`${process.env.DATA_URL}v3/api/listing/light?city=${city}` +
          `&product_type=cars&category=used&min_year=${make_year}` +
          `&model=${model}&page=${page}&availability=available`);

        const headers = getRandomHeader();

        console.log(`Fetching city: ${city}, page: ${page}`);
        const response = await axios.get(url, { headers });
        const cars = response.data?.results || [];

        if (cars.length === 0) break;

        const matched = cars
          .filter(car => {
            const matchesYear = String(car.make_year) === String(make_year);
            const matchesVariant = variant ? car.variant?.toLowerCase().includes(variant) : true;
            return matchesYear && matchesVariant;
          })
          .map(car => ({
            chassis_no: car.chassis_no,
            make_year: car.make_year,
            model: car.model,
            variant: car.variant
          }));

        filtered.push(...matched);
        page++;
       await delay(1000 + Math.random() * 500); // Delay between 1000ms and 1500ms

      }
    }

    return res.json(filtered);
  } catch (error) {
    const isRateLimited = error.response?.status === 429;
    const isBlocked = error.response?.status === 403;
    if (isRateLimited || isBlocked) {
      console.warn(`Warning: ${isRateLimited ? 'Rate limit hit' : 'Access blocked'} - ${error.message}`);
    }
    console.error('Error fetching car data:', error.message);
    return res.status(500).json({ error: 'Failed to fetch car data' });
  }
};

exports.getVehicleByChassis = async (req, res) => {
  const { chassis_no } = req.body;
  let chassisNumber = chassis_no;
  let engineNumber = '';

  if (!chassisNumber) {
    return res.status(400).json({ error: 'chassisNumber is required' });
  }

  try {
    const response = await axios.post(
      'https://api.invincibleocean.com/invincible/vehicleByChassisLite',
      {
        chassisNumber,
        engineNumber,
      },
      {
        headers: {
          clientId: process.env.CLIENT_ID,
          secretKey: process.env.SECRET_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    if (result.code === 200 && result.result?.data?.vehicle_num) {
      return res.json({ vehicle_num: result.result.data.vehicle_num });
    } else {
      return res.status(404).json({ error: result.message || 'Vehicle not found' });
    }
  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
