import type { Artist } from '~/types/artist'

export function useGeneralFunction() {
  // create hello world
  const helloWorld = () => {
    console.log('Hello World')
  }

  const formatArtistData = async (artistData: any) => {
    if (!artistData) return {} as Artist

    const { attributes } = artistData
    
    const artistTmp: Artist = {
      id: artistData.id,
      idYoutubeMusic: attributes.idYoutubeMusic || '',
      name: attributes.name,
      description: attributes.description || '',
      type: attributes.type,
      images: attributes.images,
      styles: attributes.styles || [],
      socials: attributes.socials || [],
      platforms: attributes.platforms || [],
      members: attributes.members
        ? await formatArray(attributes.members.data, formatArtistData)
        : [],
      groups: attributes.groups
        ? await formatArray(attributes.groups.data, formatArtistData)
        : [],
    }

    return artistTmp
  }

  const formatArray = async (array: any[], formatter: Function) => {
    return await Promise.all(array.map(async (item) => await formatter(item)))
  }

  // return all function
  return {
    helloWorld,
    formatArtistData,
  }
}
