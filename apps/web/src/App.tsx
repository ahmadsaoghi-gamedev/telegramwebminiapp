import { useState, useEffect } from 'react'
import { zTitleListResponse, TitleCard } from '@telegramwebminiapp/types'
import { fetchJSON } from './utils/fetchJSON'

interface ContractsResponse {
    version: string
    hash: string
}

function App() {
    const [contractStatus, setContractStatus] = useState<'loading' | 'match' | 'mismatch'>('loading')
    const [contractError, setContractError] = useState<string | null>(null)
    const [titles, setTitles] = useState<TitleCard[]>([])
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
    const [titlesLoading, setTitlesLoading] = useState(true)
    const [titlesError, setTitlesError] = useState<string | null>(null)
    const [loadingMore, setLoadingMore] = useState(false)

    // Check contracts on mount
    useEffect(() => {
        const checkContracts = async () => {
            try {
                const data = await fetchJSON<ContractsResponse>('http://localhost:3000/v1/contracts')
                // For now, just assume contracts match if we can fetch them
                // In a real app, you'd compare with a known hash or version
                setContractStatus('match')
            } catch (err) {
                setContractError(err instanceof Error ? err.message : 'Unknown error')
                setContractStatus('mismatch')
            }
        }

        checkContracts()
    }, [])

    // Fetch titles when contracts match
    useEffect(() => {
        if (contractStatus === 'match') {
            fetchTitles()
        }
    }, [contractStatus])

    const fetchTitles = async (cursor?: string) => {
        try {
            if (!cursor) {
                setTitlesLoading(true)
            } else {
                setLoadingMore(true)
            }
            setTitlesError(null)

            const params = new URLSearchParams({
                limit: '12',
                ...(cursor && { cursor })
            })

            const response = await fetchJSON<unknown>(`http://localhost:3000/v1/titles?${params}`)
            const validatedResponse = zTitleListResponse.parse(response)

            if (cursor) {
                setTitles(prev => [...prev, ...validatedResponse.items])
            } else {
                setTitles(validatedResponse.items)
            }
            setNextCursor(validatedResponse.nextCursor)
        } catch (err) {
            setTitlesError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setTitlesLoading(false)
            setLoadingMore(false)
        }
    }

    const handleLoadMore = () => {
        if (nextCursor && !loadingMore) {
            fetchTitles(nextCursor)
        }
    }

    if (contractStatus === 'loading') {
        return <div>Checking contracts...</div>
    }

    if (contractStatus === 'mismatch') {
        return (
            <div>
                <div style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px'
                }}>
                    Contracts mismatch — rebuild/refresh
                </div>
                {contractError && <div>Error: {contractError}</div>}
            </div>
        )
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Titles</h1>
            
            {titlesLoading ? (
                <div>Loading titles...</div>
            ) : titlesError ? (
                <div style={{ color: 'red' }}>Error loading titles: {titlesError}</div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        {titles.map(title => (
                            <div key={title.id} style={{ textAlign: 'center' }}>
                                {title.posterUrl ? (
                                    <img 
                                        src={title.posterUrl} 
                                        alt={title.title}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '8px'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '300px',
                                        backgroundColor: '#ddd',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        No poster
                                    </div>
                                )}
                                <h3 style={{ margin: '0', fontSize: '16px' }}>{title.title}</h3>
                                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                                    {title.type}
                                </p>
                            </div>
                        ))}
                    </div>

                    {nextCursor && (
                        <div style={{ textAlign: 'center' }}>
                            <button 
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                                    opacity: loadingMore ? 0.6 : 1
                                }}
                            >
                                {loadingMore ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default App
