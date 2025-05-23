import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { registerUser } from '../../services/api';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      toast.success("Registration successful!");
      setEmail(''); // Clear form
      setPassword(''); // Clear form
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Registration failed.");
    }
  };

  return (
    <Card className="w-[350px] m-4">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email-register">Email</Label>
              <Input 
                id="email-register" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password-register">Password</Label>
              <Input 
                id="password-register" 
                type="password" 
                placeholder="Your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" onClick={handleSubmit} className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
}
