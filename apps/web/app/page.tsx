import ContainerCard from '@/components/containercard'

export const metadata = {
  title: 'Container Library',
  icons: "/icon.svg"
}

interface Container {
  name: string
  image: string
  type: 'Desktop' | 'Browser' | 'Gaming'
}

export default async function Home() {
  const containers: Container[] = [
    {
      name: 'Debian',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Openlogo-debianV2.svg/1200px-Openlogo-debianV2.svg.png',
      type: 'Desktop'
    },
    {
      name: 'Ubuntu',
      image: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/ubuntu_plain_logo_icon_146631.png',
      type: 'Desktop'
    },
    {
      name: 'Kali Linux',
      image: 'https://seeklogo.com/images/K/kali-linux-logo-0EB0B3A81B-seeklogo.com.png',
      type: 'Desktop'
    },
    {
      name: 'Fedora',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Fedora_icon_%282021%29.svg',
      type: 'Desktop'
    },
    {
      name: 'Chromium',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Chromium_Logo.svg/1200px-Chromium_Logo.svg.png',
      type: 'Browser'
    },
    {
      name: 'Firefox',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/800px-Firefox_logo%2C_2019.svg.png',
      type: 'Browser'
    },
    {
      name: 'Steam',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png',
      type: 'Gaming'
    },
    {
      name: 'Minecraft',
      image: '/minecraft.png',
      type: 'Gaming'
    }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Container Library</h1>
      <div className="flex flex-wrap gap-4 py-6">
        {containers.map((container) => {
          return <ContainerCard key={container.name} type={container.type} image={container.image} name={container.name} />
        })}
      </div>
    </div>
  )
}
