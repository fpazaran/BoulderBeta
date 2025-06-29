import { Text, View } from "react-native";
import React, { useEffect, useState } from 'react';
import api from './api';
type DataResponse = {
  name: string;
};

export default function Index() {
  const [data, setData] = useState<DataResponse | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>
      <Text>Hello {data ? data.name : 'Loading...'}!</Text>
    </View>
  );
}
