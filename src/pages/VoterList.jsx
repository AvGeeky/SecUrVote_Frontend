import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function VoterRow({ hashId, status }) {
    return (
        <motion.div
            className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 hover:bg-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
        >
            <p className="text-white text-lg font-medium">{hashId}</p>
            <motion.p
                className={`px-4 py-2 rounded-full text-sm font-bold ${status === 'VOTED' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-gray-900'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {status}
            </motion.p>
        </motion.div>
    );
}

function VoterList() {
    const [voterData, setVoterData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Additional states for new data
    const [electionName, setElectionName] = useState('');
    const [blockchainStatus, setBlockchainStatus] = useState('');
    const [candidates, setCandidates] = useState([]);

    // Fetch data from API
    const fetchData = async () => {
        setIsRefreshing(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await fetch(apiUrl+'/publicView');
            if (!response.ok) {
                throw new Error('Failed to fetch voter details');
            }
            const data = await response.json();

            // Map the fetched voter data
            const mappedVoterData = data.voter_details.map(voter => ({
                hashId: voter.hash_id,
                status: voter.voted_status ? 'VOTED' : 'NOT VOTED'
            }));

            setVoterData(mappedVoterData);

            // Set the additional data
            if (data.name && data.name.length > 0) {
                setElectionName(data.name[0].election_name || '');
                setCandidates(data.name[0].candidates || []);
            }
            setBlockchainStatus(data.isBlockchainValid ? 'Valid' : 'Invalid');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Initial fetch and set interval to refresh data every 30 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredVoterData = voterData.filter(voter =>
        voter.hashId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-950 via-purple-800 to-pink-700 overflow-hidden px-4 py-12">
            <motion.div
                className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <header className="text-center mb-12">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white to-pink-300 text-transparent bg-clip-text"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Verify your votes.
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-1xl text-white/70 font-light"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Real-time voter data from the database. Verify your vote with your ID.
                    </motion.p>
                </header>

                {/* Display Enhanced Election Info with Hover Animation */}
                <motion.section
                    className="mb-8 bg-gradient-to-r purple-800 p-8 rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                    <div className="flex flex-col items-center text-center mb-6">
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-wider">Election Overview</h2>
                        <div className="flex items-center gap-2 text-xl font-semibold text-white">
            <span className="bg-white/20 px-4 py-1 rounded-full">
                {electionName || 'N/A'}
            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                        <motion.div
                            className="bg-white/10 p-6 rounded-lg shadow-inner"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="bg-green-500 rounded-full w-3 h-3 mr-2"></span>
                                Blockchain Status
                            </h3>
                            <p className={`text-lg font-bold ${blockchainStatus === 'Valid' ? 'text-green-300' : 'text-red-400'}`}>
                                {blockchainStatus}
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white/10 p-6 rounded-lg shadow-inner"
                            whileHover={{ scale: 1.05 }}
                        >
                            <h3 className="text-xl font-semibold mb-4">Candidates</h3>
                            {candidates.length > 0 ? (
                                <ul className="space-y-3">
                                    {candidates.map((candidate, index) => (
                                        <li key={index} className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-semibold">{candidate.name}</p>
                                                <p className="text-sm text-white/70">
                                                    {candidate.party} - {candidate.details}
                                                </p>
                                            </div>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                Party: {candidate.party}
                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-300">No candidates available</p>
                            )}
                        </motion.div>
                    </div>
                </motion.section>



                <section className="w-full mb-12">
                    <div className="flex justify-between items-center px-8 py-5 bg-white/20 backdrop-blur-sm rounded-xl mb-6">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <Users className="mr-2" /> ID
                        </h2>
                        <div className="flex items-center">
                            <div className="relative mr-4">
                                <input
                                    type="text"
                                    placeholder="Search ID"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                            </div>
                            <motion.button
                                onClick={fetchData}
                                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <RefreshCw className={isRefreshing ? 'animate-spin' : ''} />
                            </motion.button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-center mb-6">Error: {error}</p>
                    )}

                    <AnimatePresence>
                        <div className="space-y-4">
                            {filteredVoterData.map((voter) => (
                                <VoterRow
                                    key={voter.hashId}
                                    hashId={voter.hashId}
                                    status={voter.status}
                                />
                            ))}
                        </div>
                    </AnimatePresence>
                </section>

                <nav className="flex justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/"
                            className="px-8 py-4 text-lg font-semibold text-purple-900 bg-white rounded-full hover:bg-purple-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 transition-all duration-300 flex items-center"
                        >
                            <ArrowLeft className="mr-2" /> BACK TO HOME
                        </Link>
                    </motion.div>
                </nav>
            </motion.div>
        </main>
    );
}

export default VoterList;
