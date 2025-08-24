import { NextRequest, NextResponse } from 'next/server'

interface SeiStreamTransaction {
  hash: string
  timestamp: string
  value: string
  fee: string
  type: number
  actionType: string
  gasPrice: string
  gasLimit: string
  gasUsedByTransaction: string
  nonce: number
  status: boolean
  failureReason: string | null
  height: number
  to: string
  from: string
  data: string
  method: string
  blockConfirmation: number
}

interface SeiStreamResponse {
  items: SeiStreamTransaction[]
}

interface Transaction {
  hash: string
  blockNumber: string
  timestamp: string
  from: string
  to: string
  value: string
  gasUsed: string
  status: string
  type: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/i.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    console.log('Fetching transactions for address:', address)

    // Use SeiStream API - much simpler and more reliable
    const apiUrl = `https://api.seistream.app/accounts/evm/${address}/transactions`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ZenSei/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`SeiStream API error: ${response.status} ${response.statusText}`)
    }

    const data: SeiStreamResponse = await response.json()
    console.log(`SeiStream API returned ${data.items?.length || 0} transactions`)

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        transactions: [],
        totalFound: 0,
        address,
        message: 'No transactions found for this address'
      })
    }

    // Transform the data to our format (take first 10)
    const transactions: Transaction[] = data.items.slice(0, 10).map((tx) => {
      // Convert value from wei to SEI
      let value = '0'
      if (tx.value && tx.value !== '0') {
        const seiValue = parseFloat(tx.value) / 1e18
        value = seiValue.toFixed(6)
      }



      // Determine transaction type based on data and method
      let type = 'Transfer'
      if (tx.actionType === 'Execute' && tx.data && tx.data !== '0x') {
        if (tx.method === '0x095ea7b3') {
          type = 'Approve'
        } else if (tx.method === '0x617ba037') {
          type = 'Swap'
        } else {
          type = 'Contract Call'
        }
      } else if (tx.to === '0x0000000000000000000000000000000000000000') {
        type = 'Contract Creation'
      }

      return {
        hash: tx.hash,
        blockNumber: tx.height.toString(),
        timestamp: tx.timestamp,
        from: tx.from,
        to: tx.to,
        value: value === '0' ? '0 SEI' : `${value} SEI`,
        gasUsed: tx.gasUsedByTransaction?.toString() || 'Unknown',
        status: tx.status ? 'Success' : 'Failed',
        type
      }
    })

    console.log(`Successfully processed ${transactions.length} transactions`)

    return NextResponse.json({
      transactions,
      totalFound: transactions.length,
      address,
      source: 'seistream'
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 