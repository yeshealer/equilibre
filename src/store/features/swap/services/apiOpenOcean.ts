import axios from 'axios';

const OPEN_OCEAN_URL = 'https://open-api.openocean.finance/v3/kava';
export const apiOpenOcean = axios.create({
  baseURL: OPEN_OCEAN_URL,
});
