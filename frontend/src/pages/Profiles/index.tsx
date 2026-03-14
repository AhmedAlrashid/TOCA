import React, { useState, useMemo, useEffect } from 'react';
import Table, { ProfileTableColumn, ProfileViewBtn } from '../../components/core/table';
import { usePopover, type TrainingSession, type PlayerProfile } from '../../components/core/Popover';
import { getAllProfiles, type Profile } from '../../api/profile';
import { getPlayerSessions } from '../../api/session';

const Profiles: React.FC = () => {
  const { openPlayerPopover } = usePopover();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAllProfiles();
        if (result.success) {
          setProfiles(result.data);
        } else {
          setError(result.message || 'Failed to fetch profiles');
        }
      } catch (err) {
        setError('Error fetching profiles');
        console.error('Profiles fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    if (!searchValue.trim()) return profiles;
    
    const searchLower = searchValue.toLowerCase();
    return profiles.filter(profile => 
      profile.firstName.toLowerCase().includes(searchLower) ||
      profile.lastName.toLowerCase().includes(searchLower) ||
      profile.email.toLowerCase().includes(searchLower) ||
      profile.phone.includes(searchValue) ||
      profile.gender.toLowerCase().includes(searchLower) ||
      profile.centerName.toLowerCase().includes(searchLower)
    );
  }, [profiles, searchValue]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewPlayer = async (playerId: string) => {
    const player = profiles.find(p => p.id === playerId);
    if (player) {
      try {
        const sessionResult = await getPlayerSessions(playerId);
        const playerSessions = sessionResult.success ? sessionResult.data : [];
        openPlayerPopover(player as PlayerProfile, playerSessions as TrainingSession[]);
      } catch (error) {
        console.error('Failed to fetch player sessions:', error);
        openPlayerPopover(player as PlayerProfile, []);
      }
    }
  };

  const columns: ProfileTableColumn<Profile>[] = [
    {
      key: 'firstName',
      header: 'Name',
      width: 220,
      render: (row) => `${row.firstName} ${row.lastName}`,
      getSortValue: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      header: 'Email',
      width: 260,
      maxWidth: 260
    },
    {
      key: 'phone',
      header: 'Phone',
      width: 140,
    },
    {
      key: 'gender',
      header: 'Gender',
      width: 100,
    },
    {
      key: 'dob',
      header: 'Age',
      width: 100,
      render: (row) => calculateAge(row.dob).toString(),
      getSortValue: (row) => calculateAge(row.dob)
    },
    {
      key: 'centerName',
      header: 'Center',
      width: 160
    },
    {
      key: 'createdAt',
      header: 'Created at',
      width: 160,
      render: (row) => formatDate(row.createdAt),
      getSortValue: (row) => new Date(row.createdAt)
    },
    {
      key: 'actions',
      header: '',
      width: 100,
      sortable: false,
      render: (row) => (
        <ProfileViewBtn onClick={() => handleViewPlayer(row.id)} />
      )
    }
  ];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div style={{
      flex: 1,
      padding: '40px',
      backgroundColor: 'white',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 700, 
        color: '#212529',
        marginBottom: '30px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Player Profiles
      </h1>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px',
          color: '#666'
        }}>
          Loading profiles...
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '24px',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <Table
          columns={columns}
          rows={filteredProfiles}
          page={page}
          pageSize={pageSize}
          total={filteredProfiles.length}
          pageSizeOptions={[5, 10, 25]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          getRowId={(row) => row.id}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search profiles..."
        />
      )}
    </div>
  );
};

export default Profiles;