import {useState} from "react";

export const useLoading = () => {
  const [isLoading, setLoadingStatus] = useState(true);
  return {
    isLoading,
    setLoadingStatus
  }
}

