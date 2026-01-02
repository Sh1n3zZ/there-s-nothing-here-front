import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SubtitleInfo } from "@/components/YTSubtitle/SubtitleInfo"
import {
  downloadYouTubeSubtitles,
  type YouTubeSubtitleResponse,
  type YouTubeSubtitleFileResult,
} from "@/client/subtitle"

export function YouTubeSubtitle() {
  const [youtubeUrls, setYoutubeUrls] = useState<string>("")
  const [outputWord, setOutputWord] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [subtitleResponse, setSubtitleResponse] = useState<YouTubeSubtitleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    // Parse URLs from textarea (split by newlines and filter empty lines)
    const urls = youtubeUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (urls.length === 0) {
      setError("Please enter at least one YouTube URL")
      return
    }

    setLoading(true)
    setError(null)
    setSubtitleResponse(null)

    try {
      const result = await downloadYouTubeSubtitles({
        urls,
        output_word: outputWord,
      })

      if (outputWord) {
        // Handle file download
        const fileResult = result as YouTubeSubtitleFileResult
        fileResult.download()
      } else {
        // Handle JSON response
        const jsonResult = result as YouTubeSubtitleResponse
        setSubtitleResponse(jsonResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download subtitles")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-urls">YouTube URLs</Label>
            <InputGroup>
              <InputGroupTextarea
                id="youtube-urls"
                placeholder="Enter YouTube URLs, one per line (e.g., https://www.youtube.com/watch?v=...)"
                value={youtubeUrls}
                onChange={(e) => setYoutubeUrls(e.target.value)}
                rows={6}
                className="min-h-[120px]"
              />
            </InputGroup>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="output-word"
                checked={outputWord}
                onCheckedChange={setOutputWord}
              />
              <Label htmlFor="output-word" className="cursor-pointer">
                Output as Word document
              </Label>
            </div>
            <Button
              onClick={handleDownload}
              disabled={loading || youtubeUrls.trim().length === 0}
            >
              {loading ? "Downloading..." : "Download Subtitles"}
            </Button>
          </div>
          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
      {subtitleResponse && !outputWord && (
        <SubtitleInfo data={subtitleResponse} />
      )}
    </div>
  )
}

