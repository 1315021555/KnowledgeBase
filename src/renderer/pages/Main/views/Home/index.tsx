import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Avatar,
} from "@chakra-ui/react";

function App() {
  return (
    <Box p={8} bg="white" minH="100vh">
      {/* 顶部问候语 */}
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        Good evening, ZhiChao Lin
      </Text>

      {/* 横向排列的 Recently visited */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Recently visited
        </Text>
        <HStack spacing={4}>
          <VisitedItem title="weq" time="1h ago" />
          <VisitedItem title="report" time="1d ago" />
          <VisitedItem title="Tasks" time="1d ago" />
          <VisitedItem title="test" time="1d ago" />
          <VisitedItem title="复盘记录" time="May 14, 2024" />
        </HStack>
        <Button mt={4} colorScheme="blue" size="sm">
          New page
        </Button>
      </Box>

      {/* 横向排列的 Upcoming events */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Upcoming events
        </Text>
        <HStack spacing={4}>
          <EventItem
            title="My first meeting"
            time="9 AM - Office"
            date="Mar 17"
            action="Join meeting"
          />
          <EventItem
            title="Lunch"
            time="1 PM - Restaurant"
            date="Tue"
            action="See your upcoming events"
          />
          <EventItem
            title="Grocery shopping"
            time="11 AM - Store"
            date="Mar 18"
            action="Connect Notion Calendar"
          />
          <EventItem
            title="Birthday celebration"
            time="All day"
            date="Mar 19"
            action=""
          />
        </HStack>
      </Box>
    </Box>
  );
}

// 最近访问的项目组件
function VisitedItem({ title, time }: any) {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      minW="150px"
      textAlign="center"
    >
      <Text fontWeight="medium">{title}</Text>
      <Text fontSize="sm" color="gray.500">
        {time}
      </Text>
    </Box>
  );
}

// 即将到来的事件组件
function EventItem({ title, time, date, action }: any) {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      minW="200px"
      textAlign="center"
    >
      <Text fontSize="lg" fontWeight="bold">
        {date}
      </Text>
      <Text fontWeight="medium" mt={2}>
        {title}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {time}
      </Text>
      {action && (
        <Button mt={2} size="sm" colorScheme="blue">
          {action}
        </Button>
      )}
    </Box>
  );
}

export default App;
