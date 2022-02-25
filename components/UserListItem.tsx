import { Button, ListGroup } from "react-bootstrap";
import { supabase } from "../lib/supabaseClient";
import { ReservationItem } from "../model/Reservation";

interface UserListItemProps {
  reservation: ReservationItem;
  handleDelete: () => void;
}

const UserListItem = ({ reservation, handleDelete }: UserListItemProps) => {
  return (
    <ListGroup.Item as="li" className="d-flex justify-content-between">
      <h4 className="my-auto">{reservation.username}</h4>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </ListGroup.Item>
  );
};

export default UserListItem;
