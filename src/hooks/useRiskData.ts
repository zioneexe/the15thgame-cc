import { useState, useEffect, useMemo } from 'react';
import { Risk, RiskFilters } from '../types/types';
import { loadRisksFromFile } from '../utils/csvParser';

interface UseRiskDataReturn {
  risks: Risk[];
  filteredRisks: Risk[];
  categories: string[];
  statuses: string[];
  filters: RiskFilters;
  setFilters: React.Dispatch<React.SetStateAction<RiskFilters>>;
  loading: boolean;
}

export const useRiskData = (): UseRiskDataReturn => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<RiskFilters>({
    category: '',
    status: '',
    minRiskScore: '',
    maxRiskScore: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await loadRisksFromFile('/data/risks.csv');
      setRisks(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      if (filters.category && risk.category !== filters.category) return false;
      if (filters.status && risk.status !== filters.status) return false;
      if (filters.minRiskScore && risk.totalRiskScore < Number(filters.minRiskScore)) return false;
      if (filters.maxRiskScore && risk.totalRiskScore > Number(filters.maxRiskScore)) return false;
      return true;
    });
  }, [risks, filters]);

  const categories = useMemo(() => [...new Set(risks.map(r => r.category))], [risks]);
  const statuses = useMemo(() => [...new Set(risks.map(r => r.status))], [risks]);

  return {
    risks,
    filteredRisks,
    categories,
    statuses,
    filters,
    setFilters,
    loading
  };
};