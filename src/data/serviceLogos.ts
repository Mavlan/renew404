import type { SimpleIcon } from 'simple-icons'
import type { IconifyIcon } from '@iconify/vue'
import adobeCreativeCloudIcon from '@iconify-icons/simple-icons/adobecreativecloud'
import amazonIcon from '@iconify-icons/simple-icons/amazon'
import amazonPrimeIcon from '@iconify-icons/simple-icons/amazonprime'
import canvaIcon from '@iconify-icons/simple-icons/canva'
import nintendoSwitchIcon from '@iconify-icons/simple-icons/nintendoswitch'
import primeVideoIcon from '@iconify-icons/simple-icons/primevideo'
import xboxIcon from '@iconify-icons/simple-icons/xbox'
import awsIcon from '@iconify-icons/logos/aws'
import azureIcon from '@iconify-icons/logos/azure-icon'
import microsoftIcon from '@iconify-icons/logos/microsoft-icon'
import oneDriveIcon from '@iconify-icons/logos/microsoft-onedrive'
import googleOneIcon from '@iconify-icons/logos/google-one'
import googleWorkspaceIcon from '@iconify-icons/logos/google-workspace'
import {
  siAkamai,
  siApplemusic,
  siAppletv,
  siBattledotnet,
  siBilibili,
  siClaude,
  siCloudflare,
  siCursor,
  siDigitalocean,
  siDiscord,
  siDropbox,
  siEa,
  siFigma,
  siGithubcopilot,
  siGodaddy,
  siGoogle,
  siGooglecloud,
  siGoogledrive,
  siGooglegemini,
  siIcloud,
  siJetbrains,
  siNamecheap,
  siNamesilo,
  siNeteasecloudmusic,
  siNetlify,
  siNetflix,
  siNotion,
  siPerplexity,
  siPlaystation,
  siPostman,
  siReddit,
  siSpotify,
  siTaobao,
  siTelegram,
  siVercel,
  siVultr,
  siX,
  siYoutube,
} from 'simple-icons'
import chatgptUrl from '@lobehub/icons-static-svg/icons/openai.svg'
import grokUrl from '@lobehub/icons-static-svg/icons/grok.svg'
import midjourneyUrl from '@lobehub/icons-static-svg/icons/midjourney.svg'
import runwayUrl from '@lobehub/icons-static-svg/icons/runway.svg'
import extravmUrl from '../assets/service-logos/extravm.svg'
import surfercloudUrl from '../assets/service-logos/surfercloud.svg'

export interface LocalServiceLogo {
  title: string
  hex: string
  path?: string
  url?: string
  icon?: IconifyIcon
}

function logo(icon: SimpleIcon): LocalServiceLogo {
  return { title: icon.title, hex: icon.hex, path: icon.path }
}

function iconify(title: string, hex: string, icon: IconifyIcon): LocalServiceLogo {
  return { title, hex, icon }
}

export const SERVICE_LOGOS: Readonly<Record<string, LocalServiceLogo>> = {
  chatgpt: { title: 'ChatGPT', hex: '10A37F', url: chatgptUrl },
  claude: logo(siClaude),
  'google-gemini': logo(siGooglegemini),
  perplexity: logo(siPerplexity),
  grok: { title: 'Grok', hex: '111111', url: grokUrl },
  midjourney: { title: 'Midjourney', hex: '111111', url: midjourneyUrl },
  runway: { title: 'Runway', hex: '6C5CE7', url: runwayUrl },
  'github-copilot': logo(siGithubcopilot),
  cursor: logo(siCursor),
  jetbrains: logo(siJetbrains),
  figma: logo(siFigma),
  canva: iconify('Canva', '00C4CC', canvaIcon),
  'adobe-creative-cloud': iconify('Adobe Creative Cloud', 'DA1F26', adobeCreativeCloudIcon),
  postman: logo(siPostman),
  cloudflare: logo(siCloudflare),
  extravm: { title: 'ExtraVM', hex: '00C3E6', url: extravmUrl },
  surfercloud: { title: 'SurferCloud', hex: '1C60F5', url: surfercloudUrl },
  vercel: logo(siVercel),
  netlify: logo(siNetlify),
  digitalocean: logo(siDigitalocean),
  vultr: logo(siVultr),
  akamai: logo(siAkamai),
  aws: iconify('Amazon Web Services', 'FF9900', awsIcon),
  'microsoft-azure': iconify('Microsoft Azure', '0078D4', azureIcon),
  'google-cloud': logo(siGooglecloud),
  namecheap: logo(siNamecheap),
  namesilo: logo(siNamesilo),
  godaddy: logo(siGodaddy),
  google: logo(siGoogle),
  'google-one': iconify('Google One', '4285F4', googleOneIcon),
  'google-workspace': iconify('Google Workspace', '4285F4', googleWorkspaceIcon),
  microsoft: iconify('Microsoft', '737373', microsoftIcon),
  'google-drive': logo(siGoogledrive),
  notion: logo(siNotion),
  dropbox: logo(siDropbox),
  onedrive: iconify('Microsoft OneDrive', '0078D4', oneDriveIcon),
  icloud: logo(siIcloud),
  netflix: logo(siNetflix),
  youtube: logo(siYoutube),
  'apple-tv': logo(siAppletv),
  'prime-video': iconify('Prime Video', '00A8E1', primeVideoIcon),
  spotify: logo(siSpotify),
  'apple-music': logo(siApplemusic),
  bilibili: logo(siBilibili),
  'netease-cloud-music': logo(siNeteasecloudmusic),
  battlenet: logo(siBattledotnet),
  xbox: iconify('Xbox', '107C10', xboxIcon),
  playstation: logo(siPlaystation),
  'nintendo-switch': iconify('Nintendo Switch', 'E60012', nintendoSwitchIcon),
  ea: logo(siEa),
  x: logo(siX),
  telegram: logo(siTelegram),
  discord: logo(siDiscord),
  reddit: logo(siReddit),
  amazon: iconify('Amazon', 'FF9900', amazonIcon),
  'amazon-prime': iconify('Amazon Prime', '00A8E1', amazonPrimeIcon),
  taobao: logo(siTaobao),
}

export function getServiceLogo(iconKey?: string): LocalServiceLogo | undefined {
  return iconKey ? SERVICE_LOGOS[iconKey] : undefined
}
