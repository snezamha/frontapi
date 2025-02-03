"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

export function AuthComponent() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGithub] = useState(false);
  const t = useTranslations("auth");
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn("google", {
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL + "/",
        //callbackUrl: "/",
      });
    } catch (error) {
      console.log(error, "error");
      toast({
        variant: "destructive",
        description: t("errorGoogle"),
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const loginWithGitHub = async () => {
    setIsLoadingGithub(true);
    try {
      await signIn("github", {
        callbackUrl: process.env.NEXT_PUBLIC_APP_URL + "/",
        //callbackUrl: "/",
      });
    } catch (error) {
      console.log(error, "error");
      toast({
        variant: "destructive",
        description: t("errorGitHub"),
      });
    } finally {
      setIsLoadingGithub(false);
    }
  };

  return (
    <Card className="my-5 shadow-lg ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("authentication")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button
            variant="outline"
            onClick={loginWithGitHub}
            disabled={isLoadingGitHub}
          >
            {isLoadingGitHub ? (
              <Icon
                icon="octicon:mark-github-24"
                className="w-4 h-4 animate-spin"
              />
            ) : (
              <Icon icon="octicon:mark-github-24" className="w-4 h-4" />
            )}
            {t("github")}
          </Button>
          <Button
            variant="outline"
            onClick={loginWithGoogle}
            disabled={isLoadingGoogle}
          >
            {isLoadingGoogle ? (
              <Icon
                icon="entypo-social:google"
                className="w-4 h-4 animate-spin"
              />
            ) : (
              <Icon icon="entypo-social:google" className="w-4 h-4" />
            )}
            {t("google")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
