import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useSocketContext } from "../../context/Socket";
import userAxiosInstance from "../../../axios/userAxionInstance";
import UserChat from "./userChat";
// import UserChat from "./UserChat";


interface Trainer {
    trainerId: string;
    trainerName: string;
    trainerImage: string;
    hasNewMessage: boolean;
  }

function ChatSideBar() {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.id;
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(
    null
  );
  const { socket } = useSocketContext();

  // Fetch trainers with confirmed bookings
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/api/user/bookings-details/${userId}`
        );
        const confirmedBookings = response.data.filter(
          (booking: any) => booking.bookingStatus === "Confirmed"
        );

        const seenTrainerIds = new Set();
        const uniqueTrainers = confirmedBookings.filter((booking: any) => {
          if (seenTrainerIds.has(booking.trainerId)) {
            return false;
          }
          seenTrainerIds.add(booking.trainerId);
          return true;
        });

        setTrainers(
          uniqueTrainers.map((booking: any) => ({
            trainerId: booking.trainerId,
            trainerName: booking.trainerName,
            trainerImage: booking.trainerImage || "/default-avatar.png",
            hasNewMessage: false,
          }))
        );
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();
  }, [userId]);

  useEffect(() => {
    const handleNewMessage = (data: { userId: string, receiverId: string }) => {
      setTrainers((prevTrainers) => {
        const updatedTrainers = [...prevTrainers];
        const index = updatedTrainers.findIndex(
          (trainer) => trainer.trainerId === data.userId && userId === data.receiverId
        );
  
        if (index > -1) {
          updatedTrainers[index] = {
            ...updatedTrainers[index],
            hasNewMessage: true,
          };
  
          // Move trainer to the top of the list
          const [trainer] = updatedTrainers.splice(index, 1);
          updatedTrainers.unshift(trainer);
        }
        return updatedTrainers;
      });
    };
  
    socket?.on("messageUpdate", handleNewMessage);
  
    return () => {
      socket?.off("messageUpdate", handleNewMessage);
    };
  }, [socket, trainers]);
  

  const handleTrainerSelect = (trainerId: string) => {
    setSelectedTrainerId(trainerId);
    setTrainers((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer.trainerId === trainerId
          ? { ...trainer, hasNewMessage: false }
          : trainer
      ) 
    );
  };

  return (
    <div className="flex">
      <div className="p-6 bg-gray-100 min-h-screen w-1/4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <div
                key={trainer.trainerId}
                onClick={() => handleTrainerSelect(trainer.trainerId)}
                className={`flex items-center justify-between mb-2 border-b border-gray-200 pb-2 cursor-pointer rounded-md ${
                  selectedTrainerId === trainer.trainerId
                    ? "bg-blue-400 text-white"
                    : "bg-blue-100 text-gray-800"
                } transition-all`}
              >
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={trainer.trainerImage}
                    alt={`${trainer.trainerName}'s Avatar`}
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{trainer.trainerName}</h3>
                    {trainer.hasNewMessage && (
                      <span className="text-sm text-red-500">New Message</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p>No trainers found to chat with.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-[900px] h-[600px]  overflow-auto shadow-lg">
        {selectedTrainerId ? (
          <UserChat trainerId={selectedTrainerId} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-xl">
              Select a trainer to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSideBar;
