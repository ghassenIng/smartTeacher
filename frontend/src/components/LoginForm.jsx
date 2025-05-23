import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { loginUser } from '../../services/api'; // Adjusted path
import { setToken } from '../../services/tokenService'; // Import setToken

export function LoginForm({ onLoginSuccess }) { // Accept onLoginSuccess prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      toast.success("Login successful!");
      setToken(response.access_token); // Store the token
      if (onLoginSuccess) {
        onLoginSuccess(); // Notify parent component
      }
      setEmail(''); // Clear form
      setPassword(''); // Clear form
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Login failed.");
    }
  };

  return (
    <Card className="w-[350px] m-4">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email-login">Email</Label>
              <Input 
                id="email-login" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password-login">Password</Label>
              <Input 
                id="password-login" 
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
        <Button type="submit" onClick={handleSubmit} className="w-full">Login</Button>
      </CardFooter>
    </Card>
  );
}
