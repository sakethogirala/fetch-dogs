import { JSX, useEffect, useState, useCallback } from 'react'
import {Box, Select, Button, SimpleGrid, Image,Heading, Text, Flex,} from '@chakra-ui/react'
import api from '../api'
// import { J } from 'framer-motion/dist/types.d-CQt5spQA'

export interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
}

export default function Search() : JSX.Element {
    const [breeds, setBreeds] = useState<string[]>([])
    const [selectedBreed, setSelectedBreed] = useState<string>('')
    const [dogs, setDogs] = useState<Dog[]>([])
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [prevCursor, setPrevCursor] = useState<string | null>(null)
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [match, setMatch] = useState<Dog | null>(null)

    // fetch breeds
    useEffect(() => {api.get<string[]>('/dogs/breeds').then(res => setBreeds(res.data))}, [])

    // fetch dogs whenever filter or sort order changes

    const fetchDogs = useCallback(async (cursor?: string) => {
        const params: any = { sort: `breed:${sortOrder}`, size: 10, from: cursor }
        if (selectedBreed) {
            params.breeds = [selectedBreed]
        }
        
        const searchRes = await api.get<{resultIds: string[], total: number, next: string | null, prev: string | null}>('/dogs/search', { params })
        setNextCursor(searchRes.data.next)
        setPrevCursor(searchRes.data.prev)
        const dogRes = await api.post<Dog[]>('/dogs', searchRes.data.resultIds)
        setDogs(dogRes.data)
    }, [selectedBreed, sortOrder])

    useEffect(() => {fetchDogs()}, [fetchDogs])


    // handle favorites toggle 
    const toggleFavorite = (dogId: string) => {
        setFavorites(fav => {
            const next = new Set(fav)
            next.has(dogId) ? next.delete(dogId) : next.add(dogId)
            return next
        })
    }

    // handle a match
    const handleMatch = async () => {
        if (!favorites.size) return
        const matchRes = await api.post<{ match: string }>('/dogs/match', Array.from(favorites))
        const dogRes = await api.post<Dog[]>('/dogs', [matchRes.data.match])
        const matchedDog = dogRes.data[0]
        setMatch(matchedDog)
    }

    return (
        <Box p="6">
            <Flex mb="4" align="center" gap="4">
            <Select
                placeholder="All breeds"
                w="200px"
                value={selectedBreed}
                onChange={e => setSelectedBreed(e.target.value)}
            >
                {breeds.map(b => (
                <option key={b} value={b}>{b}</option>
                ))}
            </Select>
    
            <Button onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}>
                Sort: {sortOrder.toUpperCase()}
            </Button>
    
            <Button colorScheme="pink" onClick={handleMatch} ml="auto">
                Generate Match ({favorites.size})
            </Button>
            </Flex>
    
            {match && (
            <Box mb="6" p="4" bg="gray.100" borderRadius="md">
                <Heading size="md">Your Match!</Heading>
                <Flex align="center" mt="2">
                <Image boxSize="80px" src={match.img} alt={match.name} mr="4" />
                <Box>
                    <Text fontWeight="bold">{match.name}</Text>
                    <Text>{match.breed}, {match.age} yrs — {match.zip_code}</Text>
                </Box>
                </Flex>
            </Box>
            )}
    
            <SimpleGrid columns={[1,2,3]} spacing="6">
            {dogs.map(dog => (
                <Box
                key={dog.id}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                position="relative"
                >
                <Image src={dog.img} alt={dog.name} w="100%" h="200px" objectFit="cover" />
                <Box p="4">
                    <Heading size="sm">{dog.name}</Heading>
                    <Text fontSize="sm">{dog.breed}</Text>
                    <Text fontSize="sm">Age: {dog.age}</Text>
                    <Text fontSize="sm">ZIP: {dog.zip_code}</Text>
                </Box>
                <Button
                    size="sm"
                    variant="ghost"
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme={favorites.has(dog.id) ? 'red' : 'gray'}
                    onClick={() => toggleFavorite(dog.id)}
                >
                    {favorites.has(dog.id) ? '❤️' : '♡'}
                </Button>
                </Box>
            ))}
            </SimpleGrid>
    
            <Flex mt="6" justify="space-between">
            <Button onClick={() => fetchDogs(prevCursor!)} isDisabled={!prevCursor}>
                Previous
            </Button>
            <Button onClick={() => fetchDogs(nextCursor!)} isDisabled={!nextCursor}>
                Next
            </Button>
            </Flex>
        </Box>
    )
}
