// Simple test script to debug auth issues
const testLogin = async () => {
  try {
    console.log('Testing login...')
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@unilorin.edu.ng',
        password: 'test123'
      })
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

const testRegister = async () => {
  try {
    console.log('Testing registration...')
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@unilorin.edu.ng',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+2348012345678',
        role: 'student',
        studentId: 'TEST001',
        department: 'Computer Science',
        level: '300'
      })
    })
    
    const data = await response.json()
    console.log('Registration status:', response.status)
    console.log('Registration data:', data)
    
  } catch (error) {
    console.error('Registration test error:', error)
  }
}

// Run tests
console.log('Starting auth tests...')
testRegister().then(() => {
  setTimeout(() => {
    testLogin()
  }, 1000)
})
