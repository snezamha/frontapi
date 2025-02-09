'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Locale, Scope } from '@/types/locales';
import { locales } from '@/config/locales';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TranslationsMap = {
  [locale in Locale]: Record<string, string>;
};

function SkeletonLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-full p-3 border rounded-md flex flex-col gap-2"
        >
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const t = useTranslations('translationsManagement');
  const { toast } = useToast();

  const [availableScopes, setAvailableScopes] = useState<Scope[]>([]);
  const [scope, setScope] = useState<Scope>('');
  const [translationsMap, setTranslationsMap] = useState<TranslationsMap>(
    () => {
      const empty: TranslationsMap = {} as TranslationsMap;
      locales.forEach((l) => {
        empty[l] = {};
      });
      return empty;
    }
  );
  const [loading, setLoading] = useState(false);

  const [openAddScopeModal, setOpenAddScopeModal] = useState(false);
  const [newScopeName, setNewScopeName] = useState('');

  const [openAddKeyModal, setOpenAddKeyModal] = useState(false);
  const [localeForNewKey, setLocaleForNewKey] = useState<Locale | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [openDeleteScopeModal, setOpenDeleteScopeModal] = useState(false);

  useEffect(() => {
    async function loadScopes() {
      try {
        const res = await fetch('/api/translations/scopes');
        if (!res.ok) throw new Error('Error fetching scopes');
        const data = await res.json();
        setAvailableScopes(data);
        if (data.length > 0) {
          setScope(data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadScopes();
  }, []);

  useEffect(() => {
    if (!scope) return;
    setLoading(true);

    async function loadAllTranslations() {
      try {
        const promises = locales.map(async (locale) => {
          const res = await fetch(`/api/translations/messages/${locale}`);
          if (!res.ok)
            throw new Error('Error fetching translations for ' + locale);
          const data = await res.json();
          return {
            locale,
            scopeTranslations: data[scope] || {},
          };
        });

        const results = await Promise.all(promises);

        setTranslationsMap((prev) => {
          const newMap = { ...prev };
          for (const { locale, scopeTranslations } of results) {
            newMap[locale] = scopeTranslations;
          }
          return newMap;
        });
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAllTranslations();
  }, [scope]);

  const openNewScopeModal = () => {
    setNewScopeName('');
    setOpenAddScopeModal(true);
  };

  const handleConfirmNewScope = () => {
    if (!newScopeName) return;
    if (!availableScopes.includes(newScopeName)) {
      setAvailableScopes((prev) => [...prev, newScopeName]);
      setScope(newScopeName);
    }
    setOpenAddScopeModal(false);
  };

  const handleDeleteScopeClick = () => {
    setOpenDeleteScopeModal(true);
  };

  const handleConfirmDeleteScope = async () => {
    if (!scope) return;
    try {
      const res = await fetch(`/api/translations/scopes?scope=${scope}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete scope');
      }

      setAvailableScopes((prev) => {
        const filtered = prev.filter((s) => s !== scope);
        if (filtered.length > 0) {
          setScope(filtered[0]);
        } else {
          setScope('');
        }
        return filtered;
      });

      setTranslationsMap((prev) => {
        const newMap = { ...prev };
        locales.forEach((l) => {
          newMap[l] = {};
        });
        return newMap;
      });
    } catch (error) {
      console.error('Error deleting scope:', error);
    } finally {
      setOpenDeleteScopeModal(false);
    }
  };

  const handleTranslationChange = (
    locale: Locale,
    key: string,
    value: string
  ) => {
    setTranslationsMap((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [key]: value,
      },
    }));
  };

  const openNewKeyModal = (locale: Locale) => {
    setLocaleForNewKey(locale);
    setNewKeyName('');
    setOpenAddKeyModal(true);
  };

  const handleConfirmNewKey = () => {
    if (!localeForNewKey || !newKeyName) {
      setOpenAddKeyModal(false);
      return;
    }
    setTranslationsMap((prev) => {
      const newMap = { ...prev };
      newMap[localeForNewKey] = {
        ...newMap[localeForNewKey],
        [newKeyName]: '',
      };
      return newMap;
    });
    setOpenAddKeyModal(false);
  };

  const handleDeleteKey = (locale: Locale, key: string) => {
    setTranslationsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[locale][key];
      return newMap;
    });
  };

  const handleSaveAll = async (e: FormEvent) => {
    e.preventDefault();
    if (!scope) {
      toast({
        description: t('invalidScope'),
        variant: 'destructive',
      });
      return;
    }

    let allSuccess = true;

    for (const lang of locales) {
      const translationsToSave = translationsMap[lang] || {};

      const res = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: lang,
          scope,
          translations: translationsToSave,
        }),
      });

      if (!res.ok) {
        allSuccess = false;
      }
    }

    if (allSuccess) {
      toast({
        description: t('translationsSaved'),
        variant: 'default',
      });
    } else {
      toast({
        description: t('translationsSaveError'),
        variant: 'destructive',
      });
    }
  };
  const breadcrumbItems = [{ title: t('title'), link: '/translations' }];

  return (
    <>
      <Dialog
        open={openDeleteScopeModal}
        onOpenChange={setOpenDeleteScopeModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">{t('deleteScope')}</DialogTitle>

            <DialogDescription className="text-start">
              {t('deleteScopeConfirmation', { scope })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmDeleteScope}>
              {t('confirm')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpenDeleteScopeModal(false)}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openAddScopeModal} onOpenChange={setOpenAddScopeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">{t('addScope')}</DialogTitle>
            <DialogDescription className="text-start">
              {t('enterNewScopeName')}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              value={newScopeName}
              onChange={(e) => setNewScopeName(e.target.value)}
              placeholder=""
            />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmNewScope}>{t('confirm')}</Button>
            <Button
              variant="secondary"
              onClick={() => setOpenAddScopeModal(false)}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openAddKeyModal} onOpenChange={setOpenAddKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-start">
              {t('addKeyFor', {
                language:
                  localeForNewKey === 'fa' ? t('faLabel') : t('enLabel'),
              })}
            </DialogTitle>
            <DialogDescription className="text-start">
              {t('enterNewKeyForLocale', { locale: localeForNewKey })}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder=""
            />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmNewKey}>{t('confirm')}</Button>
            <Button
              variant="secondary"
              onClick={() => setOpenAddKeyModal(false)}
            >
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader className="mb-6 border-b">
          <CardTitle>
            <Breadcrumbs items={breadcrumbItems} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Label className="text-start">{t('scopeLabel')}</Label>
            <Select
              value={scope}
              onValueChange={(val) => setScope(val)}
              disabled={!availableScopes.length}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('scopePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableScopes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 mt-2 justify-between">
              <Button variant="default" onClick={openNewScopeModal}>
                {t('addScope')}
              </Button>
              <Button variant="destructive" onClick={handleDeleteScopeClick}>
                {t('deleteScope')}
              </Button>
            </div>
          </div>

          <Separator />

          {scope ? (
            loading ? (
              <SkeletonLoader />
            ) : (
              <form onSubmit={handleSaveAll}>
                <Tabs defaultValue={locales[0]}>
                  <TabsList className="mb-4 flex justify-center">
                    {locales.map((locale) => (
                      <TabsTrigger key={locale} value={locale}>
                        {locale === 'fa'
                          ? t('faLabel')
                          : locale === 'en'
                            ? t('enLabel')
                            : t('deLabel')}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {locales.map((locale) => (
                    <TabsContent key={locale} value={locale}>
                      <div className="mb-3 flex justify-center">
                        <Button
                          type="button"
                          onClick={() => openNewKeyModal(locale)}
                        >
                          {t('addKeyFor', {
                            language:
                              locale === 'fa'
                                ? t('faLabel')
                                : locale === 'en'
                                  ? t('enLabel')
                                  : t('deLabel'),
                          })}
                        </Button>
                      </div>

                      <ScrollArea className="h-screen p-2 rounded-md border">
                        <div className="flex flex-col items-center gap-2">
                          {Object.entries(translationsMap[locale] || {}).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="w-full p-3 border rounded-md flex flex-col gap-2"
                              >
                                <Label className="text-sm">{key}:</Label>
                                <Input
                                  value={value}
                                  onChange={(e) =>
                                    handleTranslationChange(
                                      locale,
                                      key,
                                      e.target.value
                                    )
                                  }
                                  className="text-start"
                                />
                                <div className="flex justify-end">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteKey(locale, key)}
                                  >
                                    {t('deleteKey')}
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-4 flex justify-end">
                  <Button type="submit" variant="default" className="px-6">
                    {t('save')}
                  </Button>
                </div>
              </form>
            )
          ) : (
            <p className="text-start">{t('noScope')}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
