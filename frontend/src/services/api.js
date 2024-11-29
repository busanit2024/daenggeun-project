export const fetchAlba = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alba"); // Spring Boot API 주소
      if (!response.ok) {
        throw new Error("Failed to fetch Alba data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching Alba data:", error);
      return [];
    }
  };