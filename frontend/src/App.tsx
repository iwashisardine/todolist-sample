import {
    Box,
    Button,
    Checkbox,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { IoTrashOutline } from "react-icons/io5";

interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

interface TaskResponse {
    id: number;
    title: string;
    is_completed: boolean;
}

export default function App() {
    const [inputValue, setInputValue] = React.useState("");
    const [tasks, setTasks] = React.useState<Array<Task>>([]);
    const [deleteIndex, setDeleteIndex] = React.useState<number>(0);

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onOpenDeleteModal,
        onClose: onCloseDeleteModal,
    } = useDisclosure();

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/tasks/"
                );
                console.log(response);
                const taskData: Task[] = response.data.map(
                    (responseData: TaskResponse) => {
                        return {
                            id: responseData.id,
                            title: responseData.title,
                            isCompleted: responseData.is_completed,
                        };
                    }
                );
                setTasks(taskData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTasks();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleClick = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/tasks/",
                {
                    title: inputValue,
                    is_completed: false,
                }
            );
            console.log(response);
            const newTasks = [...tasks, response.data];
            setTasks(newTasks);
        } catch (err) {
            console.error(err);
        }
        // setTasks([...tasks, { title: inputValue, isCompleted: false }]);
        setInputValue("");
    };

    const toggleTaskCompletion = async (index: number) => {
        try {
            const task = tasks[index];
            console.log(task);
            console.log(task.isCompleted);
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/tasks/${task.id}/`,
                {
                    is_completed: !task.isCompleted,
                }
            );
            console.log(response);
            const newTasks = tasks.map((task, i) =>
                i === index ? { ...task, isCompleted: !task.isCompleted } : task
            );
            setTasks(newTasks);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (index: number) => {
        try {
            const task = tasks[index];
            const response = await axios.delete(
                `http://127.0.0.1:8000/api/tasks/${task.id}/`
            );
            console.log(response);
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
            onCloseDeleteModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box>
            <HStack>
                <Input
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="create a new task"
                />
                <Button onClick={handleClick}>ADD</Button>
            </HStack>
            <Tabs>
                <TabList>
                    <Tab>ALL</Tab>
                    <Tab>Ongoing</Tab>
                    <Tab>Completed</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <VStack mt="8px" align="start">
                            {tasks.map((task, index) => (
                                <Checkbox
                                    key={index}
                                    isChecked={task.isCompleted}
                                    onChange={() => toggleTaskCompletion(index)}
                                >
                                    {task.title}
                                </Checkbox>
                            ))}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack mt="8px" align="start">
                            {tasks.map(
                                (task, index) =>
                                    !task.isCompleted && (
                                        <Checkbox
                                            key={index}
                                            isChecked={task.isCompleted}
                                            onChange={() =>
                                                toggleTaskCompletion(index)
                                            }
                                        >
                                            {task.title}
                                        </Checkbox>
                                    )
                            )}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack mt="8px" align="start">
                            {tasks.map(
                                (task, index) =>
                                    task.isCompleted && (
                                        <HStack>
                                            <Checkbox
                                                key={index}
                                                isChecked={task.isCompleted}
                                                onChange={() =>
                                                    toggleTaskCompletion(index)
                                                }
                                            >
                                                {task.title}
                                            </Checkbox>
                                            <IconButton
                                                key={index}
                                                variant="ghost"
                                                icon={<IoTrashOutline />}
                                                aria-label="Delete"
                                                size="8px"
                                                onClick={() => {
                                                    onOpenDeleteModal();
                                                    setDeleteIndex(index);
                                                }}
                                            />
                                        </HStack>
                                    )
                            )}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Are you sure you want to delete the task?
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>This action cannot be undone.</ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={() => deleteTask(deleteIndex)}
                        >
                            Delete
                        </Button>
                        <Button variant="ghost">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
