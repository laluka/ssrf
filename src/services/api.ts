import Papa from 'papaparse';
import { StreamData } from '../types';

export async function fetchStreamData(): Promise<StreamData[]> {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQl0fYlik6fvtVqSZ0MrFS9LugV8izIwbc9GPSAcOELk4tyhixYMT1K5OpJX4LZgHHE9s6O6ZwCtWXl/pub?gid=0&single=true&output=csv";
  
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const streams = results.data
            .filter((row: any) => row.date && row.covered_link && row.stream_name && row.stream_link)
            .map((row: any) => ({
              date: row.date,
              covered_link: row.covered_link,
              stream_name: row.stream_name,
              stream_link: row.stream_link
            }))
            .sort((a: StreamData, b: StreamData) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          resolve(streams);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching stream data:', error);
    return [];
  }
}