import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Col, Form, ListGroup, Row, Stack } from "react-bootstrap";
import UserListItem from "../components/UserListItem";
import { supabase } from "../lib/supabaseClient";
import { ReservationItem } from "../model/Reservation";
import { Formik } from "formik";
import * as yup from "yup";

interface IFormValues {
  fullName: string;
  email: string;
}

const schema = yup.object().shape({
  fullName: yup.string().required("This field is required"),
  email: yup.string().email("Must be a valid email"),
});

const Home = () => {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  useEffect(() => {
    getReservations();
  }, []);
  const getReservations = async () => {
    let { data, error } = await supabase
      .from("reservations")
      .select(`id, is_active, user_name, user_email`)
      .eq("is_active", true)
      .order("id");

    if (error) {
      alert(error);
      return;
    }

    if (!data) {
      return;
    }

    const reservations: ReservationItem[] = data.map((x) => {
      return {
        id: x.id,
        email: x.user_email,
        username: x.user_name,
        isActive: x.is_active,
      };
    });

    setReservations([]);
    setReservations(reservations);
  };

  const handleDelete = async (reservationId: number) => {
    let { error } = await supabase
      .from("reservations")
      .update({
        is_active: false,
        updated_at: new Date(),
      })
      .match({ id: reservationId });

    if (error) {
      alert("There was an error updating your reservation. Please try again.");
      return;
    }

    const filteredReservations = reservations.filter(
      (x) => x.id !== reservationId
    );

    setReservations([]);
    setReservations(filteredReservations);

    let { data } = await supabase
      .from("reservations")
      .select(`user_name, user_email`)
      .eq("is_active", true)
      .order("id")
      .range(0, 1);

    if (!data) {
      return;
    }

    const users = data.map((x) => {
      return {
        username: x.user_name,
        email: x.user_email,
      };
    });

    if (users[0]?.email) {
      const firstEmail = {
        to: users[0].email,
        subject: "Your turn for the toolkit",
        message: `${users[0].username}, it is your turn to use the RDA Toolkit.`,
      };

      fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(firstEmail),
      });
    }

    if (users[1]?.email) {
      const secondEmail = {
        to: users[1].email,
        subject: "You are second in line",
        message: `${users[1].username}, you are second in line to use the RDA Toolkit.`,
      };

      fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secondEmail),
      });
    }
  };

  const handleSubmit = async (data: IFormValues) => {
    let { error } = await supabase.from("reservations").insert([
      {
        user_name: data.fullName,
        user_email: data.email,
      },
    ]);

    if (error) {
      alert("Could not add reservation. Please try again.");
    }

    getReservations();
  };

  const initialValues: IFormValues = {
    fullName: "",
    email: "",
  };

  return (
    <>
      <Head>
        <title>Waiting List</title>
        <meta name="description" content="Waitlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack gap={3}>
          <ListGroup>
            {(reservations ?? []).map((reservation) => (
              <UserListItem
                reservation={reservation}
                key={`${reservation.id}`}
                handleDelete={() => handleDelete(reservation.id)}
              />
            ))}
          </ListGroup>
          <Formik
            validationSchema={schema}
            onSubmit={(values, actions) => {
              actions.validateForm();
              handleSubmit(values);
              actions.setSubmitting(false);
            }}
            initialValues={initialValues}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Col} controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.fullName && !errors.fullName}
                      isInvalid={touched.fullName && !!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.email && !errors.email}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else. Using an
                      email is not required, but you will be notified when it is
                      your turn.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Join
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </Stack>
      </main>
    </>
  );
};

export default Home;
