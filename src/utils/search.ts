import { StreamData } from '../types';

export function searchStreams(streams: StreamData[], searchTerm: string): StreamData[] {
  const lowercaseSearch = searchTerm.toLowerCase();
  
  return streams.filter((stream) => {
    return (
      stream.stream_name.toLowerCase().includes(lowercaseSearch) ||
      stream.covered_link.toLowerCase().includes(lowercaseSearch) ||
      stream.date.toLowerCase().includes(lowercaseSearch)
    );
  });
}