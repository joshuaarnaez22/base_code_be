import {
    Button,
    Flex,
    Input,
    Textarea,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box,
    Icon,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import moment from 'moment';
interface Post {
    name: string;
    comment: string;
    dateAdded: string;
}

export default function Page() {
    const [name, setName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);

    const handleClick = () => {
        if (name == '' || comment == '') return alert('Please fill all fields');
        const data = {
            name,
            comment,
            dateAdded: moment().format('h:mm:ss'),
        };
        setPosts((posts: any) => [...posts, { ...data }]);
        setName('');
        setComment('');
    };

    const handleDelete = (index: number) => {
        if (confirm('Are you sure you want to delete this'))
            setPosts((posts) => posts.filter((post, i) => i !== index));
    };

    return (
        <Flex
            direction="column"
            maxW="600px"
            h="100%"
            mx="auto"
            justify="center"
            gap="5"
            mt="30px"
            overflow="hidden"
        >
            <Textarea
                height="200px"
                placeholder="Comment"
                variant="normal"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Input
                placeholder="Name"
                size="lg"
                variant="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button variant="normal" onClick={handleClick}>
                Submit
            </Button>
            <TableContainer w="inherit">
                <Table variant="simple">
                    <TableCaption>List of Posts</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Comment</Th>
                            <Th>Date Added</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {posts.map(({ comment, name, dateAdded }, index) => {
                            return (
                                <Tr key={index}>
                                    <Td>{name}</Td>
                                    <Td>{comment}</Td>
                                    <Td>{dateAdded}</Td>
                                    <Td>
                                        <Button
                                            color="red300"
                                            variant="solid"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <Icon as={MdDelete} w="5" h="5" />
                                            Delete
                                        </Button>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    );
}
