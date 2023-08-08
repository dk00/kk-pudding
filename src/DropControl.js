import {useState, useEffect} from 'react'
import {useSearchParams} from 'next/navigation'
import {machines} from '../utils'
import styles from '../styles/DronControl.module.css'

const DropControl = () => {
  const searchParams = useSearchParams()
  const [employeeId, setEmployeeId] = useState('')
  const [status, setStatus] = useState('ready')
  const [result, setResult] = useState('')

  const pay = async ({machineId}) => {
    setStatus('fetching')
    setResult('')
    try {
      const result = await fetch(
        `/api/pudding?vid=${machineId}&staffId=${employeeId}`
      ).then(response => response.json())
      setResult(result.result || JSON.stringify(result, null, 2))
      setStatus('ready')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  useEffect(() => {
    const currentEmployeeId =
      searchParams.get('id') || localStorage.employeeId || ''
    const defaultMachineId = searchParams.get('v')
    setEmployeeId(currentEmployeeId)
    console.debug({currentEmployeeId, defaultMachineId})
    if (currentEmployeeId && machines[defaultMachineId]) {
      pay({machineId: defaultMachineId})
    }
  }, [searchParams])
  useEffect(() => {
    localStorage.employeeId = employeeId
  }, [employeeId])

  return (
    <div className={styles.container}>
      <h2>{status}</h2>
      {result && <pre>{result}</pre>}
      <div className={styles.machineList}>
        {Object.keys(machines).map(tag => (
          <button
            type="button"
            disabled={/fetching/.test(status)}
            onClick={async () => {
              pay({machineId: tag})
            }}>
            {tag}
          </button>
        ))}
      </div>
      <label>
        Employee Id Number
        <input
          value={employeeId}
          onChange={event => setEmployeeId(event.target.value)}
        />
      </label>
    </div>
  )
}

export default DropControl
