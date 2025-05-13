import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, FormControl, FormLabel, Input, Button, Heading } from '@chakra-ui/react'
import api from '../api'

export default function Login() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const Navigate = useNavigate()
    const [error, setError]   = useState<string|null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            await api.post('/auth/login', { name, email })
            Navigate('/search')
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred')
            console.error('Login failed:', error)
        }
    }
    return (
        <Box maxW="md" mx="auto" mt="20" p="6" boxShadow="lg" borderRadius="lg">
            <Heading as="h2" size="lg" mb="6" textAlign="center"> Welcome to Fetch Dogs!</Heading>
            <form onSubmit={handleSubmit}> 
                <FormControl mb="4">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                    />
                </FormControl>
                <FormControl mb="6">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Your email"
                    />
                </FormControl>
                <Button colorScheme="teal" type="submit" width="full">Login</Button>
            </form>
        </Box>
    );
}