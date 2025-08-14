import { useState, useEffect } from 'react'
import { contractHash } from '@telegramwebminiapp/types'

interface ContractsResponse {
    version: string
    hash: string
}

function App() {
    const [status, setStatus] = useState<'loading' | 'match' | 'mismatch'>('loading')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkContracts = async () => {
            try {
                const response = await fetch('http://localhost:3000/v1/contracts')
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const data: ContractsResponse = await response.json()
                const localHash = contractHash()

                if (data.hash === localHash) {
                    setStatus('match')
                } else {
                    setStatus('mismatch')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                setStatus('mismatch')
            }
        }

        checkContracts()
    }, [])

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (status === 'mismatch') {
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
                {error && <div>Error: {error}</div>}
            </div>
        )
    }

    return <div>OK</div>
}

export default App
