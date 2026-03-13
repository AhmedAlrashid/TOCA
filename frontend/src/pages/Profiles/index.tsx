import React, { useState, useMemo } from 'react';
import ProfileTable, { ProfileTableColumn, ProfileViewBtn } from '../../components/core/HousyTable';
import { usePopover, type TrainingSession, type PlayerProfile } from '../../components/core/Popover';

// Sample profile data (in a real app, this would come from an API)
const sampleProfiles: PlayerProfile[] = [
  {
    id: "47cb55dd-134d-459b-8892-bbba4f512399",
    email: "sabrina.williams@example.com",
    firstName: "Sabrina",
    lastName: "Williams",
    phone: "+1-674-268-2062",
    gender: "Female",
    dob: "2014-04-06",
    centerName: "Costa Mesa",
    createdAt: "2023-11-16T00:00:00Z"
  },
  {
    id: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    email: "morgan.johnson@example.com",
    firstName: "Morgan",
    lastName: "Johnson",
    phone: "+1-888-327-1007",
    gender: "Male",
    dob: "2009-12-04",
    centerName: "Costa Mesa",
    createdAt: "2024-11-09T00:00:00Z"
  },
  {
    id: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    email: "alex.jones@example.com",
    firstName: "Alex",
    lastName: "Jones",
    phone: "+1-300-796-6531",
    gender: "Male",
    dob: "2010-06-25",
    centerName: "Costa Mesa",
    createdAt: "2024-01-31T00:00:00Z"
  }
];

// Sample training sessions data (in a real app, this would come from an API)
const sampleTrainingSessions: TrainingSession[] = [
  {
    id: "008bfbdd-7914-4488-bf3a-915d998119f1",
    playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
    trainerName: "Trainer Lisa",
    startTime: "2025-12-30T11:00:00Z",
    endTime: "2025-12-30T12:00:00Z",
    numberOfBalls: 153,
    bestStreak: 42,
    numberOfGoals: 60,
    score: 73.4,
    avgSpeedOfPlay: 3.68,
    numberOfExercises: 8
  },
  {
    id: "0560bf11-1253-412e-bde2-1004aae842f2",
    playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
    trainerName: "Coach Mike",
    startTime: "2025-12-24T06:00:00Z",
    endTime: "2025-12-24T07:00:00Z",
    numberOfBalls: 121,
    bestStreak: 27,
    numberOfGoals: 40,
    score: 95.5,
    avgSpeedOfPlay: 5.06,
    numberOfExercises: 8
  },
  {
    id: "783adad2-e377-40bb-bd81-50326cec3d7a",
    playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
    trainerName: "Coach David",
    startTime: "2026-01-05T04:00:00Z",
    endTime: "2026-01-05T05:00:00Z",
    numberOfBalls: 137,
    bestStreak: 16,
    numberOfGoals: 47,
    score: 93.9,
    avgSpeedOfPlay: 3.91,
    numberOfExercises: 11
  },
  {
    id: "d457ecac-83da-444c-bf77-fca6091c8e09",
    playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
    trainerName: "Coach David",
    startTime: "2026-01-31T02:00:00Z",
    endTime: "2026-01-31T03:00:00Z",
    numberOfBalls: 205,
    bestStreak: 20,
    numberOfGoals: 53,
    score: 91.4,
    avgSpeedOfPlay: 5.28,
    numberOfExercises: 4
  },
  {
    id: "112bd4bb-a5ef-483a-a31b-6a59548e3166",
    playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
    trainerName: "Trainer Lisa",
    startTime: "2025-12-03T10:00:00Z",
    endTime: "2025-12-03T12:00:00Z",
    numberOfBalls: 133,
    bestStreak: 41,
    numberOfGoals: 54,
    score: 87.3,
    avgSpeedOfPlay: 4.13,
    numberOfExercises: 6
  },
  {
    id: "586c3f18-2e34-4cbf-81d0-87067f134bd3",
    playerId: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    trainerName: "Trainer Sarah",
    startTime: "2025-12-25T07:00:00Z",
    endTime: "2025-12-25T08:00:00Z",
    numberOfBalls: 207,
    bestStreak: 17,
    numberOfGoals: 38,
    score: 77.8,
    avgSpeedOfPlay: 4.46,
    numberOfExercises: 8
  },
  {
    id: "1c59f0ea-64e9-48a3-8463-ff0d8888ddcf",
    playerId: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    trainerName: "Coach Alex",
    startTime: "2025-11-20T07:00:00Z",
    endTime: "2025-11-20T08:00:00Z",
    numberOfBalls: 233,
    bestStreak: 20,
    numberOfGoals: 36,
    score: 96.4,
    avgSpeedOfPlay: 3.26,
    numberOfExercises: 8
  },
  {
    id: "c917f5cd-0531-4831-b0a8-495f11b4fa01",
    playerId: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    trainerName: "Trainer Lisa",
    startTime: "2026-01-15T05:00:00Z",
    endTime: "2026-01-15T06:00:00Z",
    numberOfBalls: 206,
    bestStreak: 32,
    numberOfGoals: 42,
    score: 90.6,
    avgSpeedOfPlay: 3.25,
    numberOfExercises: 10
  },
  {
    id: "681274ed-a8d4-49ff-9733-8a2ff0481d72",
    playerId: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    trainerName: "Trainer Lisa",
    startTime: "2026-01-27T03:00:00Z",
    endTime: "2026-01-27T04:00:00Z",
    numberOfBalls: 210,
    bestStreak: 34,
    numberOfGoals: 27,
    score: 81.4,
    avgSpeedOfPlay: 3.07,
    numberOfExercises: 4
  },
  {
    id: "e30d3efa-e2c7-48fd-87d8-444c98022729",
    playerId: "36a023af-f32b-4be9-95dd-35f4f82433d7",
    trainerName: "Coach David",
    startTime: "2026-01-05T07:00:00Z",
    endTime: "2026-01-05T08:00:00Z",
    numberOfBalls: 140,
    bestStreak: 29,
    numberOfGoals: 54,
    score: 98.2,
    avgSpeedOfPlay: 3.38,
    numberOfExercises: 7
  },
  {
    id: "983259ee-34cd-498f-b8ee-a9e759716802",
    playerId: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    trainerName: "Coach Alex",
    startTime: "2025-11-28T03:00:00Z",
    endTime: "2025-11-28T04:00:00Z",
    numberOfBalls: 230,
    bestStreak: 13,
    numberOfGoals: 61,
    score: 76.4,
    avgSpeedOfPlay: 4.95,
    numberOfExercises: 4
  },
  {
    id: "28463916-2f73-4214-8570-eba0a39176de",
    playerId: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    trainerName: "Trainer Sarah",
    startTime: "2026-01-09T04:00:00Z",
    endTime: "2026-01-09T04:00:00Z",
    numberOfBalls: 182,
    bestStreak: 30,
    numberOfGoals: 38,
    score: 93.6,
    avgSpeedOfPlay: 5.43,
    numberOfExercises: 5
  },
  {
    id: "1f96985d-dcd4-44e8-a944-ebbaea7f8c46",
    playerId: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    trainerName: "Coach Alex",
    startTime: "2025-12-18T09:00:00Z",
    endTime: "2025-12-18T11:00:00Z",
    numberOfBalls: 129,
    bestStreak: 31,
    numberOfGoals: 22,
    score: 76.0,
    avgSpeedOfPlay: 3.71,
    numberOfExercises: 10
  },
  {
    id: "0d3df9bd-ca38-43d7-bf80-7e57251952b4",
    playerId: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    trainerName: "Trainer Lisa",
    startTime: "2025-12-07T03:00:00Z",
    endTime: "2025-12-07T04:00:00Z",
    numberOfBalls: 225,
    bestStreak: 37,
    numberOfGoals: 17,
    score: 78.7,
    avgSpeedOfPlay: 4.83,
    numberOfExercises: 11
  },
  {
    id: "7615fe0e-a636-4758-9b13-bdc964dcf3fc",
    playerId: "d0cf8e03-21b2-4633-86c3-cbb4ac243f91",
    trainerName: "Coach Alex",
    startTime: "2025-11-19T07:00:00Z",
    endTime: "2025-11-19T08:00:00Z",
    numberOfBalls: 145,
    bestStreak: 42,
    numberOfGoals: 58,
    score: 77.2,
    avgSpeedOfPlay: 3.16,
    numberOfExercises: 5
  }
];

const Profiles: React.FC = () => {
  const { openPlayerPopover } = usePopover();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = useState('');

  // Filter profiles based on search
  const filteredProfiles = useMemo(() => {
    if (!searchValue.trim()) return sampleProfiles;
    
    const searchLower = searchValue.toLowerCase();
    return sampleProfiles.filter(profile => 
      profile.firstName.toLowerCase().includes(searchLower) ||
      profile.lastName.toLowerCase().includes(searchLower) ||
      profile.email.toLowerCase().includes(searchLower) ||
      profile.phone.includes(searchValue) ||
      profile.gender.toLowerCase().includes(searchLower) ||
      profile.centerName.toLowerCase().includes(searchLower)
    );
  }, [searchValue]);

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

  const handleViewPlayer = (playerId: string) => {
    const player = sampleProfiles.find(p => p.id === playerId);
    if (player) {
      openPlayerPopover(player, sampleTrainingSessions);
    }
  };

  const columns: ProfileTableColumn<PlayerProfile>[] = [
    {
      key: 'id',
      header: 'ID',
      width: 50,
      tight: true,
      render: (row) => {
        const index = filteredProfiles.findIndex(p => p.id === row.id);
        return (index + 1).toString();
      },
      getSortValue: (row) => {
        const index = filteredProfiles.findIndex(p => p.id === row.id);
        return index + 1;
      }
    },
    {
      key: 'firstName',
      header: 'Name',
      width: 180,
      render: (row) => `${row.firstName} ${row.lastName}`,
      getSortValue: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      header: 'Email',
      width: 200,
      maxWidth: 200
    },
    {
      key: 'phone',
      header: 'Phone',
      width: 130,
    },
    {
      key: 'gender',
      header: 'Gender',
      width: 80,
      tight: true
    },
    {
      key: 'dob',
      header: 'Age',
      width: 60,
      tight: true,
      render: (row) => calculateAge(row.dob).toString(),
      getSortValue: (row) => calculateAge(row.dob)
    },
    {
      key: 'centerName',
      header: 'Center',
      width: 100
    },
    {
      key: 'createdAt',
      header: 'Created at',
      width: 110,
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
      
      <ProfileTable
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
    </div>
  );
};

export default Profiles;